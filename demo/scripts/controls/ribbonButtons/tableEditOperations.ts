import { editTable } from 'roosterjs-editor-api';
import { FormatState, IEditor, TableOperation } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

type TableEditOperationsKey =
    | 'deleteTable'
    | 'deleteRow'
    | 'deleteColumn'
    | 'insertAbove'
    | 'insertBelow'
    | 'insertLeft'
    | 'insertRight'
    | 'merge'
    | 'mergeAbove'
    | 'mergeBelow'
    | 'mergeLeft'
    | 'mergeRight';

/**
 * Key of localized strings of Table Edit Operations button
 */
export type TableEditOperationsStringKey = 'buttonNameTableEditOperations';

const tableEditOperationsLabel: Record<TableEditOperationsKey, string> = {
    insertAbove: 'Insert Above',
    insertBelow: 'Insert Below',
    insertLeft: 'Insert Left',
    insertRight: 'Insert Right',
    merge: 'Merge Cells',
    deleteTable: 'Delete Table',
    deleteRow: 'Delete Row',
    deleteColumn: 'Delete Column',
    mergeAbove: 'Merge Above',
    mergeBelow: 'Merge Below',
    mergeLeft: 'Merge Left',
    mergeRight: 'Merge Right',
};

const tableEditOperations: Record<TableEditOperationsKey, TableOperation> = {
    insertAbove: TableOperation.InsertAbove,
    insertBelow: TableOperation.InsertBelow,
    insertLeft: TableOperation.InsertLeft,
    insertRight: TableOperation.InsertRight,
    merge: TableOperation.MergeCells,
    deleteTable: TableOperation.DeleteTable,
    deleteRow: TableOperation.DeleteRow,
    deleteColumn: TableOperation.DeleteColumn,
    mergeAbove: TableOperation.MergeAbove,
    mergeBelow: TableOperation.MergeBelow,
    mergeLeft: TableOperation.MergeLeft,
    mergeRight: TableOperation.MergeRight,
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
