import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import {
    Browser,
    getPendableFormatState,
    Position,
    PendableFormatNames,
    PendableFormatCommandMap,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    PluginEventType,
    NodePosition,
    PendableFormatState,
    PluginEvent,
} from 'roosterjs-editor-types';

/**
 * DOMEventPlugin handles customized DOM events, including:
 * 1. IME state management
 * 2. Selection management
 * 3. Cut and Drop management
 * 4. Pending format state management
 * 5. Scroll container and scroll event management
 */
export default class DOMEventPlugin implements EditorPlugin {
    private editor: Editor;
    private inIme = false;
    private disposer: () => void;
    private cachedPosition: NodePosition;
    private cachedFormatState: PendableFormatState;

    constructor(private disableRestoreSelectionOnFocus: boolean) {}

    getName() {
        return 'DOMEvent';
    }

    initialize(editor: Editor) {
        this.editor = editor;

        this.disposer = editor.addDomEventHandler({
            // 1. IME state management
            compositionstart: () => (this.inIme = true),
            compositionend: (rawEvent: CompositionEvent) => {
                this.inIme = false;
                editor.triggerPluginEvent(PluginEventType.CompositionEnd, {
                    rawEvent,
                });
            },

            // 2. Cut and drop management
            drop: this.onNativeEvent,
            cut: this.onNativeEvent,

            // 3. Selection mangement
            focus: this.onFocus,
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: this.onBlur,
        });

        this.editor.getScrollContainer().addEventListener('scroll', this.onScroll);
    }

    dispose() {
        this.editor.getScrollContainer().removeEventListener('scroll', this.onScroll);

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
                this.cachedPosition = this.getCurrentPosition();
                this.cachedFormatState = event.formatState;
                break;
            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
            case PluginEventType.ContentChanged:
                // If content or position is changed (by keyboard, mouse, or code),
                // check if current position is still the same with the cached one (if exist),
                // and clear cached format if position is changed since it is out-of-date now
                if (
                    this.cachedPosition &&
                    !this.cachedPosition.equalTo(this.getCurrentPosition())
                ) {
                    this.clear();
                }
                break;
        }
    }

    /**
     * Restore cached pending format state (if exist) to current selection
     */
    public restorePendingFormatState() {
        if (this.cachedFormatState) {
            let formatState = getPendableFormatState(this.editor.getDocument());
            (<PendableFormatNames[]>Object.keys(PendableFormatCommandMap)).forEach(key => {
                if (this.cachedFormatState[key] != formatState[key]) {
                    this.editor
                        .getDocument()
                        .execCommand(PendableFormatCommandMap[key], false, null);
                }
            });
            this.cachedPosition = this.getCurrentPosition();
        }
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME() {
        return this.inIme;
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
        if (this.disableRestoreSelectionOnFocus) {
            if (this.cachedPosition && this.cachedFormatState) {
                let range = this.editor.getSelectionRange();
                if (
                    range.collapsed &&
                    Position.getStart(range).normalize().equalTo(this.cachedPosition)
                ) {
                    this.restorePendingFormatState();
                } else {
                    this.clear();
                }
            }
        } else {
            this.editor.restoreSavedRange();
        }
    };

    private onBlur = () => {
        this.editor.saveSelectionRange();
    };

    private onScroll = (e: UIEvent) => {
        this.editor.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.editor.getScrollContainer(),
        });
    };

    private clear() {
        this.cachedPosition = null;
        this.cachedFormatState = null;
    }

    private getCurrentPosition() {
        let range = this.editor.getSelectionRange();
        return range && Position.getStart(range).normalize();
    }
}
