import { arrayPush, Browser, isCharacterValue } from 'roosterjs-editor-dom';
import { ChangeSource, Keys, PluginEventType } from 'roosterjs-editor-types';
import type {
    ContextMenuProvider,
    DOMEventHandler,
    DOMEventPluginState,
    EditorOptions,
    EditorPlugin,
    IEditor,
    PluginWithState,
} from 'roosterjs-editor-types';

/**
 * @internal
 * DOMEventPlugin handles customized DOM events, including:
 * 1. Keyboard event
 * 2. Mouse event
 * 3. IME state
 * 4. Drop event
 * 5. Focus and blur event
 * 6. Input event
 * 7. Scroll event
 * It contains special handling for Safari since Safari cannot get correct selection when onBlur event is triggered in editor.
 */
export default class DOMEventPlugin implements PluginWithState<DOMEventPluginState> {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: DOMEventPluginState;

    /**
     * Construct a new instance of DOMEventPlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        this.state = {
            isInIME: false,
            scrollContainer: options.scrollContainer || contentDiv,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: !options.allowKeyboardEventPropagation,
            contextMenuProviders:
                options.plugins?.filter<ContextMenuProvider<any>>(isContextMenuProvider) || [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'DOMEvent';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;

        const document = this.editor.getDocument();
        //Record<string, DOMEventHandler>
        const eventHandlers: Partial<
            { [P in keyof HTMLElementEventMap]: DOMEventHandler<HTMLElementEventMap[P]> }
        > = {
            // 1. Keyboard event
            keypress: this.getEventHandler(PluginEventType.KeyPress),
            keydown: this.getEventHandler(PluginEventType.KeyDown),
            keyup: this.getEventHandler(PluginEventType.KeyUp),

            // 2. Mouse event
            mousedown: PluginEventType.MouseDown,
            contextmenu: this.onContextMenuEvent,

            // 3. IME state management
            compositionstart: () => (this.state.isInIME = true),
            compositionend: (rawEvent: CompositionEvent) => {
                this.state.isInIME = false;
                editor.triggerPluginEvent(PluginEventType.CompositionEnd, {
                    rawEvent,
                });
            },

            // 4. Drag and Drop event
            dragstart: this.onDragStart,
            drop: this.onDrop,

            // 5. Focus management
            focus: this.onFocus,

            // 6. Input event
            [Browser.isIE ? 'textinput' : 'input']: this.getEventHandler(PluginEventType.Input),
        };

        // 7. onBlur handlers
        if (Browser.isSafari) {
            document.addEventListener('selectionchange', this.onSelectionChangeSafari);
        } else if (Browser.isIEOrEdge) {
            type EventHandlersIE = {
                beforedeactivate: DOMEventHandler<HTMLElementEventMap['blur']>;
            };
            (eventHandlers as EventHandlersIE).beforedeactivate = this.cacheSelection;
        } else {
            eventHandlers.blur = this.cacheSelection;
        }

        this.disposer = editor.addDomEventHandler(<Record<string, DOMEventHandler>>eventHandlers);

        // 8. Scroll event
        this.state.scrollContainer.addEventListener('scroll', this.onScroll);
        document.defaultView?.addEventListener('scroll', this.onScroll);
        document.defaultView?.addEventListener('resize', this.onScroll);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        const document = this.editor?.getDocument();
        if (document && Browser.isSafari) {
            document.removeEventListener('selectionchange', this.onSelectionChangeSafari);
        }

        document?.defaultView?.removeEventListener('resize', this.onScroll);
        document?.defaultView?.removeEventListener('scroll', this.onScroll);
        this.state.scrollContainer.removeEventListener('scroll', this.onScroll);
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onDragStart = (e: Event) => {
        const dragEvent = e as DragEvent;
        const element = this.editor?.getElementAtCursor('*', dragEvent.target as Node);

        if (element && !element.isContentEditable) {
            dragEvent.preventDefault();
        }
    };
    private onDrop = () => {
        this.editor?.runAsync(editor => {
            editor.addUndoSnapshot(() => {}, ChangeSource.Drop);
        });
    };

    private onFocus = () => {
        if (!this.state.skipReselectOnFocus) {
            const { table, coordinates } = this.state.tableSelectionRange || {};
            const { image } = this.state.imageSelectionRange || {};

            if (table && coordinates) {
                this.editor?.select(table, coordinates);
            } else if (image) {
                this.editor?.select(image);
            } else if (this.state.selectionRange) {
                this.editor?.select(this.state.selectionRange);
            }
        }

        if (!Browser.isSafari) {
            this.state.selectionRange = null;
        }
    };

    private onSelectionChangeSafari = () => {
        // Safari has problem to handle onBlur event. When blur, we cannot get the original selection from editor.
        // So we always save a selection whenever editor has focus. Then after blur, we can still use this cached selection.
        if (this.editor?.hasFocus() && !this.editor.isInShadowEdit()) {
            this.state.selectionRange = this.editor.getSelectionRange(false /*tryGetFromCache*/);
        }
    };

    private cacheSelection = () => {
        if (!this.state.selectionRange && this.editor) {
            this.state.selectionRange = this.editor.getSelectionRange(false /*tryGetFromCache*/);
        }
    };

    private onScroll = (e: Event) => {
        this.editor?.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.state.scrollContainer,
        });
    };

    private getEventHandler(eventType: PluginEventType): DOMEventHandler {
        const beforeDispatch = (event: Event) =>
            eventType == PluginEventType.Input
                ? this.onInputEvent(<InputEvent>event)
                : this.onKeyboardEvent(<KeyboardEvent>event);

        return this.state.stopPrintableKeyboardEventPropagation
            ? {
                  pluginEventType: eventType,
                  beforeDispatch,
              }
            : eventType;
    }

    private onKeyboardEvent = (event: KeyboardEvent) => {
        if (isCharacterValue(event) || (event.which >= Keys.PAGEUP && event.which <= Keys.DOWN)) {
            // Stop propagation for Character keys and Up/Down/Left/Right/Home/End/PageUp/PageDown
            // since editor already handles these keys and no need to propagate to parents
            event.stopPropagation();
        }
    };

    private onInputEvent = (event: InputEvent) => {
        event.stopPropagation();
    };

    private onContextMenuEvent = (event: MouseEvent) => {
        const allItems: any[] = [];
        const searcher = this.editor?.getContentSearcherOfCursor();
        const elementBeforeCursor = searcher?.getInlineElementBefore();

        let eventTargetNode = event.target as Node;
        if (event.button != 2 && elementBeforeCursor) {
            eventTargetNode = elementBeforeCursor.getContainerNode();
        }
        this.state.contextMenuProviders.forEach(provider => {
            const items = provider.getContextMenuItems(eventTargetNode) ?? [];
            if (items?.length > 0) {
                if (allItems.length > 0) {
                    allItems.push(null);
                }
                arrayPush(allItems, items);
            }
        });
        this.editor?.triggerPluginEvent(PluginEventType.ContextMenu, {
            rawEvent: event,
            items: allItems,
        });
    };
}

function isContextMenuProvider(source: EditorPlugin): source is ContextMenuProvider<any> {
    return !!(<ContextMenuProvider<any>>source)?.getContextMenuItems;
}
