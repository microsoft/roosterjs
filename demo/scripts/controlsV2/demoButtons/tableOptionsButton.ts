import { formatTable, getFormatState } from 'roosterjs-content-model-api';
import { TableMetadataFormat } from 'roosterjs-content-model-types';
import type { RibbonButton } from 'roosterjs-react';

const TableEditOperationMap: Partial<Record<
    TableOptionsMenuItemStringKey,
    keyof TableMetadataFormat
>> = {
    menuNameTableSetHeaderRow: 'hasHeaderRow',
    menuNameTableSetFirstColumn: 'hasFirstColumn',
    menuNameTableSetBandedColumns: 'hasBandedColumns',
    menuNameTableSetBandedRows: 'hasBandedRows',
};

/**
 * Key of localized strings of Table Options menu items
 */
type TableOptionsMenuItemStringKey =
    | 'menuNameTableSetHeaderRow'
    | 'menuNameTableSetFirstColumn'
    | 'menuNameTableSetBandedColumns'
    | 'menuNameTableSetBandedRows';

export const tableOptionsButton: RibbonButton<
    'ribbonButtonTableOptions' | TableOptionsMenuItemStringKey
> = {
    key: 'ribbonButtonTableOptions',
    iconName: '',
    unlocalizedText: 'Options',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableSetHeaderRow: 'Header Row',
            menuNameTableSetFirstColumn: 'First Column',
            menuNameTableSetBandedColumns: 'Banded Columns',
            menuNameTableSetBandedRows: 'Banded Rows',
        },
    },
    onClick: (editor, key) => {
        if (key != 'ribbonButtonTableOptions') {
            const format = getFormatState(editor);
            const tableFormatProperty = TableEditOperationMap[key];
            formatTable(
                editor,
                { [tableFormatProperty]: !format.tableFormat[tableFormatProperty] },
                true /*keepCellShade*/
            );
        }
    },
    commandBarProperties: {
        iconOnly: false,
    },
};
