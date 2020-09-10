import { Browser, isCharacterValue } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    DOMEventHandler,
    DOMEventPluginState,
    EditorOptions,
    IEditor,
    PluginEventType,
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
 */
export default class DOMEventPlugin implements PluginWithState<DOMEventPluginState> {
    private editor: IEditor;
    private disposer: () => void;
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

        this.disposer = editor.addDomEventHandler({
            // 1. Keyboard event
            keypress: this.getEventHandler(PluginEventType.KeyPress),
            keydown: this.getEventHandler(PluginEventType.KeyDown),
            keyup: this.getEventHandler(PluginEventType.KeyUp),

            // 2. Mouse event
            mousedown: PluginEventType.MouseDown,

            // 3. IME state management
            compositionstart: () => (this.state.isInIME = true),
            compositionend: (rawEvent: CompositionEvent) => {
                this.state.isInIME = false;
                editor.triggerPluginEvent(PluginEventType.CompositionEnd, {
                    rawEvent,
                });
            },

            // 4. Drop event
            drop: this.onDrop,

            // 5. Focus mangement
            focus: this.onFocus,
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: this.onBlur,

            // 6. Input event
            [Browser.isIE ? 'textinput' : 'input']: this.getEventHandler(PluginEventType.Input),
        });

        // 7. Scroll event
        this.state.scrollContainer.addEventListener('scroll', this.onScroll);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.state.scrollContainer.removeEventListener('scroll', this.onScroll);
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onDrop = (e: UIEvent) => {
        this.editor.runAsync(() => {
            this.editor.addUndoSnapshot(() => {}, ChangeSource.Drop);
        });
    };

    private onFocus = () => {
        this.editor.select(this.state.selectionRange);
        this.state.selectionRange = null;
    };

    private onBlur = () => {
        this.state.selectionRange = this.editor.getSelectionRange(false /*tryGetFromCache*/);
    };

    private onScroll = (e: UIEvent) => {
        this.editor.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.state.scrollContainer,
        });
    };

    private getEventHandler(eventType: PluginEventType): DOMEventHandler {
        return this.state.stopPrintableKeyboardEventPropagation
            ? {
                  pluginEventType: eventType,
                  beforeDispatch:
                      eventType == PluginEventType.Input ? this.onInputEvent : this.onKeybaordEvent,
              }
            : eventType;
    }

    private onKeybaordEvent = (event: KeyboardEvent) => {
        if (isCharacterValue(event)) {
            event.stopPropagation();
        }
    };

    private onInputEvent = (event: InputEvent) => {
        event.stopPropagation();
    };
}
