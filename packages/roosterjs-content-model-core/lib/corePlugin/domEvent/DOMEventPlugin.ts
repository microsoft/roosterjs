import {
    ChangeSource,
    isCharacterValue,
    isCursorMovingKey,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import type {
    DOMEventPluginState,
    IEditor,
    DOMEventRecord,
    EditorOptions,
    PluginWithState,
} from 'roosterjs-content-model-types';

const EventTypeMap: Record<string, 'keyDown' | 'keyUp' | 'keyPress'> = {
    keydown: 'keyDown',
    keyup: 'keyUp',
    keypress: 'keyPress',
};

// According to https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
// Key code will be 229 when keydown happens during IME
// We actually only see it happens in Safari
const IME_KeyDown = 229;

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
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: DOMEventPluginState;
    private isSafari = false;

    /**
     * Construct a new instance of DOMEventPlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
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
    initialize(editor: IEditor) {
        this.editor = editor;

        this.isSafari = !!this.editor.getEnvironment().isSafari;

        const document = this.editor.getDocument();
        const eventHandlers: Partial<
            { [P in keyof HTMLElementEventMap]: DOMEventRecord<HTMLElementEventMap[P]> }
        > = {
            // 1. Keyboard event
            keypress: this.keyboardEventHandler,
            keydown: this.keyboardEventHandler,
            keyup: this.keyboardEventHandler,
            input: this.inputEventHandler,

            // 2. Mouse event
            mousedown: { beforeDispatch: this.onMouseDown },

            // 3. IME state management
            compositionstart: { beforeDispatch: this.onCompositionStart },
            compositionend: { beforeDispatch: this.onCompositionEnd },

            // 4. Drag and Drop event
            dragstart: { beforeDispatch: this.onDragStart },
            drop: { beforeDispatch: this.onDrop },
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

    private keyboardEventHandler: DOMEventRecord<KeyboardEvent> = {
        beforeDispatch: event => {
            const eventType = EventTypeMap[event.type];

            if (isCharacterValue(event) || isCursorMovingKey(event)) {
                // Stop propagation for Character keys and Up/Down/Left/Right/Home/End/PageUp/PageDown
                // since editor already handles these keys and no need to propagate to parents
                event.stopPropagation();
            }

            if (this.editor && eventType && !this.isEventInIME(event)) {
                this.editor.triggerEvent(eventType, {
                    rawEvent: event,
                });
            }
        },
    };

    private inputEventHandler: DOMEventRecord<Event> = {
        beforeDispatch: event => {
            event.stopPropagation();

            if (this.editor && !this.isEventInIME(event as InputEvent)) {
                this.editor.triggerEvent('input', {
                    rawEvent: event as InputEvent,
                });
            }
        },
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

    private isEventInIME(event: KeyboardEvent | InputEvent): boolean {
        return (
            event.isComposing ||
            this.state.isInIME ||
            (this.isSafari &&
                event.type == 'keydown' &&
                (event as KeyboardEvent).keyCode == IME_KeyDown)
        );
    }
}

/**
 * @internal
 * Create a new instance of DOMEventPlugin.
 * @param option The editor option
 * @param contentDiv The editor content DIV element
 */
export function createDOMEventPlugin(
    option: EditorOptions,
    contentDiv: HTMLDivElement
): PluginWithState<DOMEventPluginState> {
    return new DOMEventPlugin(option, contentDiv);
}
