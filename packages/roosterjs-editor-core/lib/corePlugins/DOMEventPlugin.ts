import Editor from '../editor/Editor';
import PluginWithState from '../interfaces/PluginWithState';
import { Browser, Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    PluginEventType,
    NodePosition,
    PendableFormatState,
    PluginEvent,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * The state object for DOMEventPlugin
 */
export interface DOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Current pending format state
     */
    pendableFormatState: PendableFormatState;

    /**
     * The position of last pendable format state changing
     */
    pendableFormatPosition: NodePosition;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;
}

/**
 * DOMEventPlugin handles customized DOM events, including:
 * 1. Keyboard event
 * 2. Mouse event
 * 3. IME state
 * 4. Cut and Drop event
 * 5. Focus and blur event
 * 6. Input event
 * 7. Scroll event
 * 8. Pending format state
 */
export default class DOMEventPlugin implements PluginWithState<DOMEventPluginState> {
    private editor: Editor;
    private disposer: () => void;
    private mouseUpEventListerAdded: boolean;

    /**
     * Construct a new instancoe of DOMEventPlugin
     * @param state The wrapper of the state object
     */
    constructor(public readonly state: Wrapper<DOMEventPluginState>) {}

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
    initialize(editor: Editor) {
        this.editor = editor;

        this.disposer = editor.addDomEventHandler({
            // 1. Keyboard event
            keypress: PluginEventType.KeyPress,
            keydown: PluginEventType.KeyDown,
            keyup: PluginEventType.KeyUp,

            // 2. Mouse event
            mousedown: PluginEventType.MouseDown,

            // 3. IME state management
            compositionstart: () => (this.state.value.isInIME = true),
            compositionend: (rawEvent: CompositionEvent) => {
                this.state.value.isInIME = false;
                editor.triggerPluginEvent(PluginEventType.CompositionEnd, {
                    rawEvent,
                });
            },

            // 4. Cut and drop management
            drop: this.onNativeEvent,
            cut: this.onNativeEvent,

            // 5. Focus mangement
            focus: this.onFocus,
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: this.onBlur,

            // 6. Input event
            [Browser.isIE ? 'textinput' : 'input']: PluginEventType.Input,
        });

        // 7. Scroll event
        this.state.value.scrollContainer.addEventListener('scroll', this.onScroll);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.state.value.scrollContainer.removeEventListener('scroll', this.onScroll);
        this.removeMouseUpEventListener();
        this.disposer();
        this.disposer = null;
        this.editor = null;
        this.clear();
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.PendingFormatStateChanged:
                // Got PendingFormatStateChagned event, cache current position and pending format
                this.state.value.pendableFormatPosition = this.getCurrentPosition();
                this.state.value.pendableFormatState = event.formatState;
                break;
            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
            case PluginEventType.ContentChanged:
                // 2. Mouse event
                if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
                    this.editor
                        .getDocument()
                        .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
                    this.mouseUpEventListerAdded = true;
                }

                // 8. Pending format state management
                // If content or position is changed (by keyboard, mouse, or code),
                // check if current position is still the same with the cached one (if exist),
                // and clear cached format if position is changed since it is out-of-date now
                if (
                    this.state.value.pendableFormatPosition &&
                    !this.state.value.pendableFormatPosition.equalTo(this.getCurrentPosition())
                ) {
                    this.clear();
                }
                break;
        }
    }

    private onNativeEvent = (e: UIEvent) => {
        this.editor.runAsync(() => {
            this.editor.addUndoSnapshot(
                () => {},
                e.type == 'cut' ? ChangeSource.Cut : ChangeSource.Drop
            );
        });
    };

    private onFocus = () => {
        this.editor.restoreSavedRange();
    };

    private onBlur = () => {
        this.editor.saveSelectionRange();
    };

    private clear() {
        this.state.value.pendableFormatPosition = null;
        this.state.value.pendableFormatState = null;
    }

    private getCurrentPosition() {
        let range = this.editor.getSelectionRange();
        return range && Position.getStart(range).normalize();
    }

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerPluginEvent(PluginEventType.MouseUp, {
                rawEvent,
            });
        }
    };

    private onScroll = (e: UIEvent) => {
        this.editor.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.state.value.scrollContainer,
        });
    };
}
