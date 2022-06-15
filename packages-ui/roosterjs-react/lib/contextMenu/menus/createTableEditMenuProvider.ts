import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import { EditorPlugin, IEditor, TableOperation } from 'roosterjs-editor-types';
import { editTable } from 'roosterjs-editor-api';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { TableEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';

const TableEditOperationMap: Partial<Record<TableEditMenuItemStringKey, TableOperation>> = {
    menuNameTableInsertAbove: TableOperation.InsertAbove,
    menuNameTableInsertBelow: TableOperation.InsertBelow,
    menuNameTableInsertLeft: TableOperation.InsertLeft,
    menuNameTableInsertRight: TableOperation.InsertRight,
    menuNameTableDeleteTable: TableOperation.DeleteTable,
    menuNameTableDeleteColumn: TableOperation.DeleteColumn,
    menuNameTableDeleteRow: TableOperation.DeleteRow,
    menuNameTableMergeAbove: TableOperation.MergeAbove,
    menuNameTableMergeBelow: TableOperation.MergeBelow,
    menuNameTableMergeLeft: TableOperation.MergeLeft,
    menuNameTableMergeRight: TableOperation.MergeRight,
    menuNameTableMergeCells: TableOperation.MergeCells,
    menuNameTableSplitHorizontally: TableOperation.SplitHorizontally,
    menuNameTableSplitVertically: TableOperation.SplitVertically,
    menuNameTableAlignLeft: TableOperation.AlignCellLeft,
    menuNameTableAlignCenter: TableOperation.AlignCellCenter,
    menuNameTableAlignRight: TableOperation.AlignCellRight,
    menuNameTableAlignTop: TableOperation.AlignCellTop,
    menuNameTableAlignMiddle: TableOperation.AlignCellMiddle,
    menuNameTableAlignBottom: TableOperation.AlignCellBottom,
};

function onClick(key: TableEditMenuItemStringKey, editor: IEditor) {
    editor.focus();
    editTable(editor, TableEditOperationMap[key]);
}

const TableEditInsertMenuItem: ContextMenuItem<TableEditMenuItemStringKey> = {
    key: 'menuNameTableInsert',
    unlocalizedText: 'Insert',
    subItems: {
        menuNameTableInsertAbove: 'Insert above',
        menuNameTableInsertBelow: 'Insert below',
        menuNameTableInsertLeft: 'Insert left',
        menuNameTableInsertRight: 'Insert right',
    },
    onClick,
};

const TableEditDeleteMenuItem: ContextMenuItem<TableEditMenuItemStringKey> = {
    key: 'menuNameTableDelete',
    unlocalizedText: 'Delete',
    subItems: {
        menuNameTableDeleteColumn: 'Delete column',
        menuNameTableDeleteRow: 'Delete row',
        menuNameTableDeleteTable: 'Delete table',
    },
    onClick,
};

const TableEditMergeMenuItem: ContextMenuItem<TableEditMenuItemStringKey> = {
    key: 'menuNameTableMerge',
    unlocalizedText: 'Merge',
    subItems: {
        menuNameTableMergeAbove: 'Merge above',
        menuNameTableMergeBelow: 'Merge below',
        menuNameTableMergeLeft: 'Merge left',
        menuNameTableMergeRight: 'Merge right',
        '-': '-',
        menuNameTableMergeCells: 'Merge selected cells',
    },
    onClick,
};

const TableEditSplitMenuItem: ContextMenuItem<TableEditMenuItemStringKey> = {
    key: 'menuNameTableSplit',
    unlocalizedText: 'Split',
    subItems: {
        menuNameTableSplitHorizontally: 'Split horizontally',
        menuNameTableSplitVertically: 'Split vertically',
    },
    onClick,
};

const TableEditAlignMenuItem: ContextMenuItem<TableEditMenuItemStringKey> = {
    key: 'menuNameTableAlign',
    unlocalizedText: 'Align cell',
    subItems: {
        menuNameTableAlignLeft: 'Align left',
        menuNameTableAlignCenter: 'Align center',
        menuNameTableAlignRight: 'Align right',
        '-': '-',
        menuNameTableAlignTop: 'Align top',
        menuNameTableAlignMiddle: 'Align middle',
        menuNameTableAlignBottom: 'Align bottom',
    },
    onClick,
};

function getEditingTable(editor: IEditor, node: Node) {
    const td = editor.getElementAtCursor('TD,TH', node) as HTMLTableCellElement;
    const table = td && (editor.getElementAtCursor('table', td) as HTMLTableElement);

    return table?.isContentEditable ? { table, td } : null;
}

/**
 * Create a new instance of ContextMenuProvider to support table editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createTableEditMenuProvider(
    strings?: LocalizedStrings<TableEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'tableEdit',
        [
            TableEditInsertMenuItem,
            TableEditDeleteMenuItem,
            TableEditMergeMenuItem,
            TableEditSplitMenuItem,
            TableEditAlignMenuItem,
        ],
        strings,
        (editor, node) => !!getEditingTable(editor, node)
    );
}
