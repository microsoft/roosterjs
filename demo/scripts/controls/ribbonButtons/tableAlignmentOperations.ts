import { editTable } from 'roosterjs-editor-api';
import { FormatState, IEditor, TableOperation } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Table Edit Operations button
 */
export type TableAlignmentOperationsStringKey =
    | 'buttonNameTableAlignmentOperations'
    | 'buttonNameTableAlignLeft'
    | 'buttonNameTableAlignRight'
    | 'buttonNameTableAlignTop'
    | 'buttonNameTableAlignCenter'
    | 'buttonNameTableAlignMiddle'
    | 'buttonNameTableAlignBottom';

const tableAlignmentOperationsLabel: Partial<Record<TableAlignmentOperationsStringKey, string>> = {
    buttonNameTableAlignTop: 'Align Top',
    buttonNameTableAlignMiddle: 'Align Middle',
    buttonNameTableAlignBottom: 'Align Bottom',
    buttonNameTableAlignCenter: 'Align Center',
    buttonNameTableAlignLeft: 'Align Left',
    buttonNameTableAlignRight: 'Align Right',
};

const tableAlignmentOperations: Partial<Record<
    TableAlignmentOperationsStringKey,
    TableOperation
>> = {
    buttonNameTableAlignTop: TableOperation.AlignCellTop,
    buttonNameTableAlignMiddle: TableOperation.AlignCellMiddle,
    buttonNameTableAlignBottom: TableOperation.AlignCellBottom,
    buttonNameTableAlignCenter: TableOperation.AlignCellCenter,
    buttonNameTableAlignLeft: TableOperation.AlignCellLeft,
    buttonNameTableAlignRight: TableOperation.AlignCellRight,
};

/**
 * @internal
 * "TableAlignmentOperations" button on the format ribbon
 */
export const tableAlign: RibbonButton<TableAlignmentOperationsStringKey> = {
    key: 'buttonNameTableAlignmentOperations',
    unlocalizedText: 'Table Alignment Operations',
    iconName: 'TableComputed',
    dropDownMenu: {
        items: tableAlignmentOperationsLabel,
    },
    isDisabled: (format: FormatState) => {
        return format.isInTable ? false : true;
    },
    onClick: (editor, key) => {
        editTableOperation(editor, tableAlignmentOperations[key]);
    },
};

function editTableOperation(editor: IEditor, operation: TableOperation) {
    editTable(editor, operation);
}
