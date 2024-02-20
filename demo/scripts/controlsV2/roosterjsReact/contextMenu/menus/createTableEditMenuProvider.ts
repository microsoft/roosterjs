import { Colors, EditorPlugin, IEditor, TableOperation } from 'roosterjs-content-model-types';
import { createContextMenuProvider } from '../utils/createContextMenuProvider';
import { editTable, setTableCellShade } from 'roosterjs-content-model-api';
import { renderColorPicker } from '../../colorPicker/component/renderColorPicker';
import type { ContextMenuItem } from '../types/ContextMenuItem';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../colorPicker/utils/getClassNamesForColorPicker';
import type {
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
};

const ColorValues = {
    ...BackgroundColors,
    // Add this value to satisfy compiler
    menuNameTableCellShade: <Colors>(<unknown>null),
};

function onClick(key: TableEditMenuItemStringKey, editor: IEditor) {
    editTable(editor, TableEditOperationMap[key]);
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
        setTableCellShade(editor, ColorValues[key].lightModeColor);
    },
    itemRender: (item, click) => renderColorPicker(item, ColorValues, click),
    itemClassName: getColorPickerItemClassName(),
    commandBarSubMenuProperties: {
        className: getColorPickerContainerClassName(),
    },
};

function getEditingTable(editor: IEditor, node: Node) {
    const domHelper = editor.getDOMHelper();
    const td = domHelper.findClosestElementAncestor(node, 'TD,TH');
    const table = td && domHelper.findClosestElementAncestor(td, 'table');

    return table?.isContentEditable ? { table, td } : null;
}

/**
 * Create a new instance of ContextMenuProvider to support table editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export function createTableEditMenuProvider(
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
