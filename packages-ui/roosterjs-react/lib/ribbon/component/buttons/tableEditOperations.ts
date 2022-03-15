import RibbonButton from '../../type/RibbonButton';
import { editTable } from 'roosterjs-editor-api';
import { IEditor, TableOperation } from 'roosterjs-editor-types';
import { TableEditOperationsStringKey } from '../../type/RibbonButtonStringKeys';

type TableEditOperationsKey = 'deleteTable' | 'deleteRow' | 'deleteColumn';

const tableEditOperationsLabel: Record<TableEditOperationsKey, string> = {
    deleteTable: 'Delete Table',
    deleteRow: 'Delete Row',
    deleteColumn: 'Delete Column',
};

const tableEditOperations: Record<TableEditOperationsKey, TableOperation> = {
    deleteTable: TableOperation.DeleteTable,
    deleteRow: TableOperation.DeleteRow,
    deleteColumn: TableOperation.DeleteColumn,
};

/**
 * @internal
 * "TableEditOperations" button on the format ribbon
 */
export const tableEdit: RibbonButton<TableEditOperationsStringKey> = {
    key: 'buttonNameTableEditOperations',
    unlocalizedText: 'Table Edit Operations',
    iconName: 'DeleteTable',
    dropDownMenu: {
        items: tableEditOperationsLabel,
    },
    onClick: (editor, key: TableEditOperationsKey) => {
        editTableOperation(editor, tableEditOperations[key]);
    },
};

function editTableOperation(editor: IEditor, operation: TableOperation) {
    editTable(editor, operation);
}
