import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, PluginCompositionEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * DOMEventPlugin handles customized DOM events, including:
 * 1. IME state management
 * 2. Selection management
 * 3. Cut and Drop management
 */
export default class DOMEventPlugin implements EditorPlugin {
    private editor: Editor;
    private inIme = false;
    private disposer: () => void;

    constructor(private disableRestoreSelectionOnFocus: boolean) {}

    getName() {
        return 'DOMEvent';
    }

    initialize(editor: Editor) {
        this.editor = editor;

        this.disposer = editor.addDomEventHandler({
            // 1. IME state management
            compositionstart: () => (this.inIme = true),
            compositionend: (e: CompositionEvent) => {
                this.inIme = false;
                editor.triggerEvent(<PluginCompositionEvent>{
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: e,
                });
            },

            // 2. Selection mangement
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: () => editor.saveSelectionRange(),
            focus: !this.disableRestoreSelectionOnFocus && (() => editor.restoreSavedRange()),

            // 3. Cut and drop management
            drop: this.onNativeEvent,
            cut: this.onNativeEvent,
        });
    }

    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
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
}
