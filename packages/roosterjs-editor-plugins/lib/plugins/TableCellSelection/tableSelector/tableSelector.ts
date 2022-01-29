import createTableSelector from './createTableSelector';
import Disposable from 'roosterjs-editor-plugins/lib/pluginUtils/Disposable';
import { clearSelectedTableCells } from '../utils/clearSelectedTableCells';
import { IEditor } from 'roosterjs-editor-types';
// import TableEditFeature, { disposeTableEditFeature } from './TableEditorFeature';

type TableEditFeature = {
    node: Node;
    div: HTMLDivElement;
    featureHandler: Disposable;
};

/**
 * @internal
 */
export default class TableSelector {
    private tableSelector: TableEditFeature;

    constructor(
        private editor: IEditor,
        public readonly table: HTMLTableElement,
        private onChanged: () => void
    ) {
        const sizeTransformer = editor.getSizeTransformer();
        this.tableSelector = createTableSelector(table, sizeTransformer, this.onFinishEditing);
    }

    dispose() {
        this.disposeTableSelector();
    }

    private disposeTableSelector() {
        if (this.tableSelector) {
            this.disposeTableEditFeature(this.tableSelector);
            this.tableSelector = null;
        }
    }

    disposeTableEditFeature(resizer: TableEditFeature) {
        resizer.div.parentNode?.removeChild(resizer.div);
        resizer.div = null;
        resizer.featureHandler.dispose();
        resizer.featureHandler = null;
    }

    private onFinishEditing = (): void => {
        clearSelectedTableCells(this.editor);
        this.editor.focus();
        this.onChanged();
    };
}
