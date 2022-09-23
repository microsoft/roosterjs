import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import { applyCellShading, editTable } from 'roosterjs-editor-api';
import { EditorPlugin, IEditor, TableOperation } from 'roosterjs-editor-types';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { ModeIndependentColor } from 'roosterjs-editor-types';
import { renderColorPicker } from '../../colorPicker/component/renderColorPicker';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../colorPicker/utils/getClassNamesForColorPicker';
import {
    TableEditMenuItemStringKey,
    TableEditInsertMenuItemStringKey,
    TableEditDeleteMenuItemStringKey,
    TableEditMergeMenuItemStringKey,
    TableEditSplitMenuItemStringKey,
    TableEditAlignMenuItemStringKey,
    TableEditShadeMenuItemStringKey,
    TableEditAlignTableMenuItemStringKey,
} from '../types/ContextMenuItemStringKeys';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
} from '../../colorPicker/utils/backgroundColors';

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
    menuNameTableAlignTableLeft: TableOperation.AlignLeft,
    menuNameTableAlignTableCenter: TableOperation.AlignCenter,
    menuNameTableAlignTableRight: TableOperation.AlignRight,
};

const ColorValues = {
    ...BackgroundColors,
    // Add this value to satisfy compiler
    menuNameTableCellShade: <ModeIndependentColor>(<unknown>null),
};

function onClick(key: TableEditMenuItemStringKey, editor: IEditor) {
    editor.focus();
    const operation = TableEditOperationMap[key];
    if (typeof operation === 'number') {
        editTable(editor, operation);
    }
}

const TableEditInsertMenuItem: ContextMenuItem<TableEditInsertMenuItemStringKey> = {
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

const TableEditDeleteMenuItem: ContextMenuItem<TableEditDeleteMenuItemStringKey> = {
    key: 'menuNameTableDelete',
    unlocalizedText: 'Delete',
    subItems: {
        menuNameTableDeleteColumn: 'Delete column',
        menuNameTableDeleteRow: 'Delete row',
        menuNameTableDeleteTable: 'Delete table',
    },
    onClick,
};

const TableEditMergeMenuItem: ContextMenuItem<TableEditMergeMenuItemStringKey> = {
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

const TableEditSplitMenuItem: ContextMenuItem<TableEditSplitMenuItemStringKey> = {
    key: 'menuNameTableSplit',
    unlocalizedText: 'Split',
    subItems: {
        menuNameTableSplitHorizontally: 'Split horizontally',
        menuNameTableSplitVertically: 'Split vertically',
    },
    onClick,
};

const TableEditAlignMenuItem: ContextMenuItem<TableEditAlignMenuItemStringKey> = {
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

const TableEditAlignTableMenuItem: ContextMenuItem<TableEditAlignTableMenuItemStringKey> = {
    key: 'menuNameTableAlignTable',
    unlocalizedText: 'Align table',
    subItems: {
        menuNameTableAlignTableLeft: 'Align left',
        menuNameTableAlignTableCenter: 'Align center',
        menuNameTableAlignTableRight: 'Align right',
    },
    onClick,
};

const TableEditCellShadeMenuItem: ContextMenuItem<TableEditShadeMenuItemStringKey> = {
    key: 'menuNameTableCellShade',
    unlocalizedText: 'Shading',
    subItems: BackgroundColorDropDownItems,
    onClick: (key, editor) => {
        applyCellShading(editor, ColorValues[key]);
    },
    itemRender: (item, click) => renderColorPicker(item, ColorValues, click),
    itemClassName: getColorPickerItemClassName(),
    commandBarSubMenuProperties: {
        className: getColorPickerContainerClassName(),
    },
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
        <ContextMenuItem<TableEditMenuItemStringKey>[]>[
            TableEditInsertMenuItem,
            TableEditDeleteMenuItem,
            TableEditMergeMenuItem,
            TableEditSplitMenuItem,
            TableEditAlignMenuItem,
            TableEditAlignTableMenuItem,
            TableEditCellShadeMenuItem,
        ],
        strings,
        (editor, node) => !!getEditingTable(editor, node)
    );
}
