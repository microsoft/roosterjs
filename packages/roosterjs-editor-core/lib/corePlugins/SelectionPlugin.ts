import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Browser } from 'roosterjs-editor-dom';

/**
 * Selection Component helps save/restore selection when blur/focus
 */
export default class SelectionPlugin implements EditorPlugin {
    private disposers: (() => void)[];

    constructor(private disableRestoreSelectionOnFocus: boolean) {}

    getName() {
        return 'Selection';
    }

    initialize(editor: Editor) {
        this.disposers = [
            editor.addDomEventHandler(Browser.isIEOrEdge ? 'beforedeactivate' : 'blur', () =>
                editor.saveSelectionRange()
            ),
            !this.disableRestoreSelectionOnFocus &&
                editor.addDomEventHandler('focus', () => editor.restoreSavedRange()),
        ].filter(x => x);
    }

    dispose() {
        this.disposers.forEach(d => d());
        this.disposers = null;
    }
}
