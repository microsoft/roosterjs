import { editTable } from 'roosterjs-content-model-api';
import { TableOperation } from 'roosterjs-content-model-types';
import type {
    RibbonButton,
    TableEditAlignMenuItemStringKey,
    TableEditAlignTableMenuItemStringKey,
    TableEditDeleteMenuItemStringKey,
    TableEditInsertMenuItemStringKey,
    TableEditMenuItemStringKey,
    TableEditMergeMenuItemStringKey,
    TableEditSplitMenuItemStringKey,
} from 'roosterjs-react';

type DemoTableEditMenuItemStringKey =
    | TableEditMenuItemStringKey
    | 'menuNameTableShiftCellsUp'
    | 'menuNameTableShiftCellsLeft';

const TableEditOperationMap: Partial<Record<DemoTableEditMenuItemStringKey, TableOperation>> = {
    menuNameTableInsertAbove: 'insertAbove',
    menuNameTableInsertBelow: 'insertBelow',
    menuNameTableInsertLeft: 'insertLeft',
    menuNameTableInsertRight: 'insertRight',
    menuNameTableDeleteTable: 'deleteTable',
    menuNameTableDeleteColumn: 'deleteColumn',
    menuNameTableDeleteRow: 'deleteRow',
    menuNameTableMergeAbove: 'mergeAbove',
    menuNameTableMergeBelow: 'mergeBelow',
    menuNameTableMergeLeft: 'mergeLeft',
    menuNameTableMergeRight: 'mergeRight',
    menuNameTableMergeCells: 'mergeCells',
    menuNameTableSplitHorizontally: 'splitHorizontally',
    menuNameTableSplitVertically: 'splitVertically',
    menuNameTableAlignLeft: 'alignCellLeft',
    menuNameTableAlignCenter: 'alignCellCenter',
    menuNameTableAlignRight: 'alignCellRight',
    menuNameTableAlignTop: 'alignCellTop',
    menuNameTableAlignMiddle: 'alignCellMiddle',
    menuNameTableAlignBottom: 'alignCellBottom',
    menuNameTableAlignTableLeft: 'alignLeft',
    menuNameTableAlignTableCenter: 'alignCenter',
    menuNameTableAlignTableRight: 'alignRight',
    menuNameTableShiftCellsUp: 'shiftCellsUp',
    menuNameTableShiftCellsLeft: 'shiftCellsLeft',
};

export const tableInsertButton: RibbonButton<
    'ribbonButtonTableInsert' | TableEditInsertMenuItemStringKey
> = {
    key: 'ribbonButtonTableInsert',
    iconName: 'InsertColumnsRight',
    unlocalizedText: 'Insert',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableInsertAbove: 'Insert above',
            menuNameTableInsertBelow: 'Insert below',
            menuNameTableInsertLeft: 'Insert left',
            menuNameTableInsertRight: 'Insert right',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableInsert') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
};

export const tableDeleteButton: RibbonButton<
    'ribbonButtonTableDelete' | TableEditDeleteMenuItemStringKey
> = {
    key: 'ribbonButtonTableDelete',
    iconName: 'DeleteTable',
    unlocalizedText: 'Delete',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableDeleteColumn: 'Delete column',
            menuNameTableDeleteRow: 'Delete row',
            menuNameTableDeleteTable: 'Delete table',
            menuNameTableShiftCellsUp: 'Shift cells up',
            menuNameTableShiftCellsLeft: 'Shift cells left',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableDelete') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
};

export const tableMergeButton: RibbonButton<
    'ribbonButtonTableMerge' | TableEditMergeMenuItemStringKey
> = {
    key: 'ribbonButtonTableMerge',
    iconName: '',
    unlocalizedText: 'Merge',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableMergeAbove: 'Merge above',
            menuNameTableMergeBelow: 'Merge below',
            menuNameTableMergeLeft: 'Merge left',
            menuNameTableMergeRight: 'Merge right',
            '-': '-',
            menuNameTableMergeCells: 'Merge selected cells',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableMerge') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
    commandBarProperties: {
        iconOnly: false,
    },
};

export const tableSplitButton: RibbonButton<
    'ribbonButtonTableSplit' | TableEditSplitMenuItemStringKey
> = {
    key: 'ribbonButtonTableSplit',
    iconName: '',
    unlocalizedText: 'Split',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableSplitHorizontally: 'Split horizontally',
            menuNameTableSplitVertically: 'Split vertically',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableSplit') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
    commandBarProperties: {
        iconOnly: false,
    },
};

export const tableAlignCellButton: RibbonButton<
    'ribbonButtonTableAlignCell' | TableEditAlignMenuItemStringKey
> = {
    key: 'ribbonButtonTableAlignCell',
    iconName: '',
    unlocalizedText: 'Align table cell',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableAlignLeft: 'Align left',
            menuNameTableAlignCenter: 'Align center',
            menuNameTableAlignRight: 'Align right',
            '-': '-',
            menuNameTableAlignTop: 'Align top',
            menuNameTableAlignMiddle: 'Align middle',
            menuNameTableAlignBottom: 'Align bottom',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableAlignCell') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
    commandBarProperties: {
        iconOnly: false,
    },
};

export const tableAlignTableButton: RibbonButton<
    'ribbonButtonTableAlignTable' | TableEditAlignTableMenuItemStringKey
> = {
    key: 'ribbonButtonTableAlignTable',
    iconName: '',
    unlocalizedText: 'Align table',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableAlignTableLeft: 'Align left',
            menuNameTableAlignTableCenter: 'Align center',
            menuNameTableAlignTableRight: 'Align right',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableAlignTable') {
            editTable(editor, TableEditOperationMap[key]);
        }
    },
    commandBarProperties: {
        iconOnly: false,
    },
};
