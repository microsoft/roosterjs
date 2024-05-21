import { formatTable, getFormatState } from 'roosterjs-content-model-api';
import { TableMetadataFormat } from 'roosterjs-content-model-types';
import { TableOptionsMenuItemStringKey } from 'roosterjs-react/lib/contextMenu/types/ContextMenuItemStringKeys';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const TableEditOperationMap: Partial<Record<
    TableOptionsMenuItemStringKey,
    keyof TableMetadataFormat
>> = {
    menuNameTableSetHeaderRow: 'hasHeaderRow',
    menuNameTableSetFirstColumn: 'hasFirstColumn',
    menuNameTableSetBandedColumns: 'hasBandedColumns',
    menuNameTableSetBandedRows: 'hasBandedRows',
};

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
