import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Browser } from 'roosterjs-editor-dom';

/**
 * Selection Component helps save/restore selection when blur/focus
 */
export default class SelectionPlugin implements EditorPlugin {
    private disposer: () => void;

    constructor(private disableRestoreSelectionOnFocus: boolean) {}

    getName() {
        return 'Selection';
    }

    initialize(editor: Editor) {
        this.disposer = editor.addDomEventHandler({
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: () => editor.saveSelectionRange(),
            focus: !this.disableRestoreSelectionOnFocus && (() => editor.restoreSavedRange()),
        });
    }

    dispose() {
        this.disposer();
        this.disposer = null;
    }
}
