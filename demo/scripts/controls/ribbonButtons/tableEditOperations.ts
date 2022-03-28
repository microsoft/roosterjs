import { editTable } from 'roosterjs-editor-api';
import { FormatState, IEditor, TableOperation } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

type TableEditOperationsKey = 'deleteTable' | 'deleteRow' | 'deleteColumn';

/**
 * Key of localized strings of Table Edit Operations button
 */
export type TableEditOperationsStringKey = 'buttonNameTableEditOperations';

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
    isDisabled: (format: FormatState) => {
        return format.isInTable ? false : true;
    },
    onClick: (editor, key: TableEditOperationsKey) => {
        editTableOperation(editor, tableEditOperations[key]);
    },
};

function editTableOperation(editor: IEditor, operation: TableOperation) {
    editTable(editor, operation);
}
