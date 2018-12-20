import SidePanePluginImpl from '../SidePanePluginImpl';
import TablePane, { TablePaneProps } from './TablePane';
import { editTable, formatTable, insertTable } from 'roosterjs-editor-api';
import { TableFormat, TableOperation } from 'roosterjs-editor-types';

export default class TableOptionsPlugin extends SidePanePluginImpl<TablePane, TablePaneProps> {
    name: 'TableOptions';

    constructor() {
        super(TablePane, 'Table Options');
    }

    getComponentProps() {
        return {
            onEditTable: this.onEditTable,
            onFormatTable: this.onFormatTable,
            onInsertTable: this.onInsertTable,
        };
    }

    private onEditTable = (operation: TableOperation) => {
        editTable(this.editor, operation);
    };

    private onFormatTable = (format: Partial<TableFormat>) => {
        formatTable(this.editor, format);
    };

    private onInsertTable = (cols: number, rows: number) => {
        insertTable(this.editor, cols, rows);
    };
}
