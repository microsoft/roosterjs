import { ChangeSource } from '../constants/ChangeSource';
import { isCharacterValue, isCursorMovingKey } from '../publicApi/domUtils/eventUtils';
import { isNodeOfType } from 'roosterjs-content-model-dom';
import type {
    DOMEventPluginState,
    IStandaloneEditor,
    DOMEventRecord,
    StandaloneEditorOptions,
    PluginWithState,
    PluginEventType,
} from 'roosterjs-content-model-types';

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
    private editor: IStandaloneEditor | null = null;
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
    initialize(editor: IStandaloneEditor) {
        this.editor = editor;

        const document = this.editor.getDocument();
        const eventHandlers: Partial<
            { [P in keyof HTMLElementEventMap]: DOMEventRecord<HTMLElementEventMap[P]> }
        > = {
            // 1. Keyboard event
            keypress: this.getEventHandler('keyPress'),
            keydown: this.getEventHandler('keyDown'),
            keyup: this.getEventHandler('keyUp'),

            // 2. Mouse event
            mousedown: { beforeDispatch: this.onMouseDown },

            // 3. IME state management
            compositionstart: { beforeDispatch: this.onCompositionStart },
            compositionend: { beforeDispatch: this.onCompositionEnd },

            // 4. Drag and Drop event
            dragstart: { beforeDispatch: this.onDragStart },
            drop: { beforeDispatch: this.onDrop },

            // 5. Input event
            input: this.getEventHandler('input'),
        };

        this.disposer = this.editor.attachDomEvent(<Record<string, DOMEventRecord>>eventHandlers);

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
        const node = dragEvent.target as Node;
        const element = isNodeOfType(node, 'ELEMENT_NODE') ? node : node.parentElement;

        if (element && !element.isContentEditable) {
            dragEvent.preventDefault();
        }
    };

    private onDrop = () => {
        const doc = this.editor?.getDocument();

        doc?.defaultView?.requestAnimationFrame(() => {
            if (this.editor) {
                this.editor.takeSnapshot();
                this.editor.triggerEvent('contentChanged', {
                    source: ChangeSource.Drop,
                });
            }
        });
    };

    private onScroll = (e: Event) => {
        this.editor?.triggerEvent('scroll', {
            rawEvent: e,
            scrollContainer: this.state.scrollContainer,
        });
    };

    private getEventHandler(eventType: PluginEventType): DOMEventRecord {
        const beforeDispatch = (event: Event) =>
            eventType == 'input'
                ? this.onInputEvent(<InputEvent>event)
                : this.onKeyboardEvent(<KeyboardEvent>event);

        return {
            pluginEventType: eventType,
            beforeDispatch,
        };
    }

    private onKeyboardEvent = (event: KeyboardEvent) => {
        if (isCharacterValue(event) || isCursorMovingKey(event)) {
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

            this.editor.triggerEvent('mouseDown', {
                rawEvent: event,
            });
        }
    };

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerEvent('mouseUp', {
                rawEvent,
                isClicking:
                    this.state.mouseDownX == rawEvent.pageX &&
                    this.state.mouseDownY == rawEvent.pageY,
            });
        }
    };

    private onCompositionStart = () => {
        this.state.isInIME = true;
    };

    private onCompositionEnd = (rawEvent: CompositionEvent) => {
        this.state.isInIME = false;
        this.editor?.triggerEvent('compositionEnd', {
            rawEvent,
        });
    };

    private removeMouseUpEventListener() {
        if (this.editor && this.state.mouseUpEventListerAdded) {
            this.state.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }
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
