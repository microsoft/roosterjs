import { editTable } from 'roosterjs-editor-api';
import { FormatState, IEditor, TableOperation } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

type TableAlignmentOperationsKey =
    | 'alignLeft'
    | 'alignRight'
    | 'alignTop'
    | 'alignCenter'
    | 'alignMiddle'
    | 'alignBottom';

/**
 * Key of localized strings of Table Edit Operations button
 */
export type TableAlignmentOperationsStringKey = 'buttonNameTableAlignmentOperations';

const tableAlignmentOperationsLabel: Record<TableAlignmentOperationsKey, string> = {
    alignTop: 'Align Top',
    alignMiddle: 'Align Middle',
    alignBottom: 'Align Bottom',
    alignCenter: 'Align Center',
    alignLeft: 'Align Left',
    alignRight: 'Align Right',
};

const tableAlignmentOperations: Record<TableAlignmentOperationsKey, TableOperation> = {
    alignTop: TableOperation.AlignCellTop,
    alignMiddle: TableOperation.AlignCellMiddle,
    alignBottom: TableOperation.AlignCellBottom,
    alignCenter: TableOperation.AlignCellCenter,
    alignLeft: TableOperation.AlignCellLeft,
    alignRight: TableOperation.AlignCellRight,
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
    onClick: (editor, key: TableAlignmentOperationsKey) => {
        editTableOperation(editor, tableAlignmentOperations[key]);
    },
};

function editTableOperation(editor: IEditor, operation: TableOperation) {
    editTable(editor, operation);
}
