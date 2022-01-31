import createTableSelector from './createTableSelector';
import { IEditor } from 'roosterjs-editor-types';
import { TableSelectorFeature } from './TableSelectorFeature';

/**
 * @internal
 */
export default class TableSelector {
    private tableSelector: TableSelectorFeature;

    constructor(
        editor: IEditor,
        public readonly table: HTMLTableElement,
        onChanged: (table: HTMLTableElement) => void
    ) {
        const sizeTransformer = editor.getSizeTransformer();
        this.tableSelector = createTableSelector(table, sizeTransformer, onChanged);
    }

    dispose() {
        this.disposeTableSelector();
    }

    private disposeTableSelector() {
        if (this.tableSelector) {
            this.tableSelector.div.parentNode?.removeChild(this.tableSelector.div);
            this.tableSelector.div = null;
            this.tableSelector.featureHandler.dispose();
            this.tableSelector.featureHandler = null;
            this.tableSelector = null;
        }
    }
}
