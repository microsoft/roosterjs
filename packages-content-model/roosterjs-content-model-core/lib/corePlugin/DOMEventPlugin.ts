import { ChangeSource } from '../constants/ChangeSource';
import { isCharacterValue } from '../publicApi/domUtils/eventUtils';
import { Keys, PluginEventType } from 'roosterjs-editor-types';
import type {
    DOMEventPluginState,
    IStandaloneEditor,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';
import type {
    ContextMenuProvider,
    DOMEventHandler,
    EditorPlugin,
    IEditor,
    PluginWithState,
} from 'roosterjs-editor-types';

/**
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
class DOMEventPlugin implements PluginWithState<DOMEventPluginState> {
    private editor: (IStandaloneEditor & IEditor) | null = null;
    private disposer: (() => void) | null = null;
    private state: DOMEventPluginState;

    /**
     * Construct a new instance of DOMEventPlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: StandaloneEditorOptions, contentDiv: HTMLDivElement) {
        this.state = {
            isInIME: false,
            scrollContainer: options.scrollContainer || contentDiv,
            contextMenuProviders:
                options.plugins?.filter<ContextMenuProvider<any>>(isContextMenuProvider) || [],
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
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
        this.editor = editor as IStandaloneEditor & IEditor;

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
            mousedown: this.onMouseDown,
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

            // 5. Input event
            input: this.getEventHandler(PluginEventType.Input),
        };

        this.disposer = editor.addDomEventHandler(<Record<string, DOMEventHandler>>eventHandlers);

        // 7. Scroll event
        this.state.scrollContainer.addEventListener('scroll', this.onScroll);
        document.defaultView?.addEventListener('scroll', this.onScroll);
        document.defaultView?.addEventListener('resize', this.onScroll);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.removeMouseUpEventListener();

        const document = this.editor?.getDocument();

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
        this.editor?.runAsync(() => {
            if (this.editor) {
                this.editor.appendSnapshot();
                this.editor.triggerContentChangedEvent(ChangeSource.Drop);
            }
        });
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

        return {
            pluginEventType: eventType,
            beforeDispatch,
        };
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

    private onMouseDown = (event: MouseEvent) => {
        if (this.editor) {
            if (!this.state.mouseUpEventListerAdded) {
                this.editor
                    .getDocument()
                    .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
                this.state.mouseUpEventListerAdded = true;
                this.state.mouseDownX = event.pageX;
                this.state.mouseDownY = event.pageY;
            }

            this.editor.triggerPluginEvent(PluginEventType.MouseDown, {
                rawEvent: event,
            });
        }
    };

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerPluginEvent(PluginEventType.MouseUp, {
                rawEvent,
                isClicking:
                    this.state.mouseDownX == rawEvent.pageX &&
                    this.state.mouseDownY == rawEvent.pageY,
            });
        }
    };

    private onContextMenuEvent = (event: MouseEvent) => {
        const allItems: any[] = [];

        // TODO: Remove dependency to ContentSearcher
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

                allItems.push(...items);
            }
        });
        this.editor?.triggerPluginEvent(PluginEventType.ContextMenu, {
            rawEvent: event,
            items: allItems,
        });
    };

    private removeMouseUpEventListener() {
        if (this.editor && this.state.mouseUpEventListerAdded) {
            this.state.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }
}

function isContextMenuProvider(source: EditorPlugin): source is ContextMenuProvider<any> {
    return !!(<ContextMenuProvider<any>>source)?.getContextMenuItems;
}

/**
 * @internal
 * Create a new instance of DOMEventPlugin.
 * @param option The editor option
 * @param contentDiv The editor content DIV element
 */
export function createDOMEventPlugin(
    option: StandaloneEditorOptions,
    contentDiv: HTMLDivElement
): PluginWithState<DOMEventPluginState> {
    return new DOMEventPlugin(option, contentDiv);
}
