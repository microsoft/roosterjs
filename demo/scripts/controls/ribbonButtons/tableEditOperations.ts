import { editTable } from 'roosterjs-editor-api';
import { FormatState, IEditor, TableOperation } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Table Edit Operations button
 */
export type TableEditOperationsStringKey =
    | 'buttonNameTableEditOperations'
    | 'buttonNameDeleteTable'
    | 'buttonNameDeleteRow'
    | 'buttonNameDeleteColumn'
    | 'buttonNameInsertAbove'
    | 'buttonNameInsertBelow'
    | 'buttonNameInsertLeft'
    | 'buttonNameInsertRight'
    | 'buttonNameMerge'
    | 'buttonNameMergeAbove'
    | 'buttonNameMergeBelow'
    | 'buttonNameMergeLeft'
    | 'buttonNameMergeRight';

const tableEditOperationsLabel: Partial<Record<TableEditOperationsStringKey, string>> = {
    buttonNameInsertAbove: 'Insert Above',
    buttonNameInsertBelow: 'Insert Below',
    buttonNameInsertLeft: 'Insert Left',
    buttonNameInsertRight: 'Insert Right',
    buttonNameMerge: 'Merge Cells',
    buttonNameDeleteTable: 'Delete Table',
    buttonNameDeleteRow: 'Delete Row',
    buttonNameDeleteColumn: 'Delete Column',
    buttonNameMergeAbove: 'Merge Above',
    buttonNameMergeBelow: 'Merge Below',
    buttonNameMergeLeft: 'Merge Left',
    buttonNameMergeRight: 'Merge Right',
};

const tableEditOperations: Partial<Record<TableEditOperationsStringKey, TableOperation>> = {
    buttonNameInsertAbove: TableOperation.InsertAbove,
    buttonNameInsertBelow: TableOperation.InsertBelow,
    buttonNameInsertLeft: TableOperation.InsertLeft,
    buttonNameInsertRight: TableOperation.InsertRight,
    buttonNameMerge: TableOperation.MergeCells,
    buttonNameDeleteTable: TableOperation.DeleteTable,
    buttonNameDeleteRow: TableOperation.DeleteRow,
    buttonNameDeleteColumn: TableOperation.DeleteColumn,
    buttonNameMergeAbove: TableOperation.MergeAbove,
    buttonNameMergeBelow: TableOperation.MergeBelow,
    buttonNameMergeLeft: TableOperation.MergeLeft,
    buttonNameMergeRight: TableOperation.MergeRight,
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
    onClick: (editor, key) => {
        editTableOperation(editor, tableEditOperations[key]);
    },
};

function editTableOperation(editor: IEditor, operation: TableOperation) {
    editTable(editor, operation);
}
