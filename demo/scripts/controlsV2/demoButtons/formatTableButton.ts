import { formatTable } from 'roosterjs-content-model-api';
import { TableBorderFormat } from 'roosterjs-content-model-dom';
import type { TableMetadataFormat } from 'roosterjs-content-model-types';
import type { RibbonButton } from 'roosterjs-react';

const TableColors = {
    transparent: 'transparent',
    black: '#000000',
    blue: '#0C64C0',
    orange: '#DE6A19',
    yellow: '#DCBE22',
    red: '#ED5C57',
    purple: '#B36AE2',
    green: '#0C882A',
    gray: '#CCCCCC',
} as const;

const TableLightColors: Record<string, string> = {
    [TableColors.black]: '#CCCCCC',
    [TableColors.blue]: '#CEE0F2',
    [TableColors.orange]: '#F8E1D1',
    [TableColors.yellow]: '#F8F2D2',
    [TableColors.red]: '#FBDEDD',
    [TableColors.purple]: '#EFE1F9',
    [TableColors.green]: '#CEE7D4',
    [TableColors.gray]: '#F4F4F4',
};

const DEFAULT_TABLE_FORMAT: TableMetadataFormat = {
    hasHeaderRow: true,
    hasFirstColumn: true,
    hasBandedRows: true,
    hasBandedColumns: false,
    bgColorEven: null,
    bgColorOdd: null,
    headerRowCustomStyles: null,
    firstColumnCustomStyles: null,
};

type TableStyleTemplate = Omit<
    TableMetadataFormat,
    'hasHeaderRow' | 'hasFirstColumn' | 'hasBandedRows' | 'hasBandedColumns'
>;

const createTableFormat = (template: TableStyleTemplate): TableMetadataFormat => ({
    ...DEFAULT_TABLE_FORMAT,
    ...template,
    headerRowCustomStyles: template.headerRowCustomStyles ?? null,
    firstColumnCustomStyles: template.firstColumnCustomStyles ?? null,
});

const StyleTemplates: Record<string, (color: string) => TableMetadataFormat> = {
    DEFAULT: color =>
        createTableFormat({
            headerRowColor: null,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.Default,
            headerRowCustomStyles: {
                fontWeight: 'normal',
                italic: false,
            },
            firstColumnCustomStyles: {
                fontWeight: 'normal',
                italic: false,
            },
        }),
    GRID: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.Default,
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    GRID_WITH_HEADER_ROW: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.Default,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: {
                fontWeight: 'normal',
                italic: true,
                textAlign: 'end',
                borderRightColor: color,
                backgroundColor: TableColors.transparent,
            },
        }),
    SPECIAL_GRID: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.NoSideBorders,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    LIST: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: TableColors.transparent,
            bottomBorderColor: TableColors.transparent,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.Clear,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    LIST_WITH_HEADER: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.ListWithSideBorders,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: { fontWeight: 'bold', italic: false },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    LIST_SPECIAL: color =>
        createTableFormat({
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.FirstColumnHeaderExternal,
            headerRowColor: color,
            headerRowCustomStyles: { fontWeight: 'bold', italic: false },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    PLAIN: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: TableColors.transparent,
            bottomBorderColor: TableColors.transparent,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.Clear,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                borderRightColor: color,
            },
        }),
    PLAIN_LIST: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.ListWithSideBorders,
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    PLAIN_WITHOUT_BORDERS: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: TableColors.transparent,
            bottomBorderColor: TableColors.transparent,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.Clear,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: { fontWeight: 'bold', italic: false },
            firstColumnCustomStyles: { fontWeight: 'bold' },
        }),
    PLAIN_WITH_FIRST_COLUMN: color =>
        createTableFormat({
            headerRowColor: color,
            topBorderColor: TableColors.transparent,
            bottomBorderColor: TableColors.transparent,
            verticalBorderColor: TableColors.transparent,
            tableBorderFormat: TableBorderFormat.Clear,
            bgColorOdd: TableLightColors[color],
            headerRowCustomStyles: {
                fontWeight: 'normal',
                italic: true,
                borderBottomColor: color,
            },
            firstColumnCustomStyles: {
                fontWeight: 'normal',
                italic: true,
                textAlign: 'end',
                borderRightColor: color,
                backgroundColor: TableColors.transparent,
            },
        }),
};

function getPredefinedStyles(): Record<string, TableMetadataFormat> {
    return {
        TABLE_GRID: StyleTemplates.DEFAULT(TableColors.black),
        TABLE_GRID_LIGHT: StyleTemplates.DEFAULT(TableColors.gray),
        PLAIN_TABLE_1: StyleTemplates.GRID(TableColors.gray),
        PLAIN_TABLE_2: StyleTemplates.PLAIN_LIST(TableColors.black),
        PLAIN_TABLE_3: StyleTemplates.PLAIN(TableColors.black),
        PLAIN_TABLE_4: StyleTemplates.PLAIN_WITHOUT_BORDERS(TableColors.black),
        PLAIN_TABLE_5: StyleTemplates.PLAIN_WITH_FIRST_COLUMN(TableColors.black),
        GRID_TABLE_1_LIGHT: StyleTemplates.GRID(TableColors.black),
        GRID_TABLE_1_LIGHT_ACCENT_1: StyleTemplates.GRID(TableColors.blue),
        GRID_TABLE_1_LIGHT_ACCENT_2: StyleTemplates.GRID(TableColors.orange),
        GRID_TABLE_1_LIGHT_ACCENT_3: StyleTemplates.GRID(TableColors.yellow),
        GRID_TABLE_1_LIGHT_ACCENT_4: StyleTemplates.GRID(TableColors.red),
        GRID_TABLE_1_LIGHT_ACCENT_5: StyleTemplates.GRID(TableColors.purple),
        GRID_TABLE_1_LIGHT_ACCENT_6: StyleTemplates.GRID(TableColors.green),
        GRID_TABLE_2: StyleTemplates.SPECIAL_GRID(TableColors.black),
        GRID_TABLE_2_ACCENT_1: StyleTemplates.SPECIAL_GRID(TableColors.blue),
        GRID_TABLE_2_ACCENT_2: StyleTemplates.SPECIAL_GRID(TableColors.orange),
        GRID_TABLE_2_ACCENT_3: StyleTemplates.SPECIAL_GRID(TableColors.yellow),
        GRID_TABLE_2_ACCENT_4: StyleTemplates.SPECIAL_GRID(TableColors.red),
        GRID_TABLE_2_ACCENT_5: StyleTemplates.SPECIAL_GRID(TableColors.purple),
        GRID_TABLE_2_ACCENT_6: StyleTemplates.SPECIAL_GRID(TableColors.green),
        GRID_TABLE_3: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.black),
        GRID_TABLE_3_ACCENT_1: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.blue),
        GRID_TABLE_3_ACCENT_2: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.orange),
        GRID_TABLE_3_ACCENT_3: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.yellow),
        GRID_TABLE_3_ACCENT_4: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.red),
        GRID_TABLE_3_ACCENT_5: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.purple),
        GRID_TABLE_3_ACCENT_6: StyleTemplates.GRID_WITH_HEADER_ROW(TableColors.green),
        LIST_TABLE_1_LIGHT: StyleTemplates.LIST(TableColors.black),
        LIST_TABLE_1_LIGHT_ACCENT_1: StyleTemplates.LIST(TableColors.blue),
        LIST_TABLE_1_LIGHT_ACCENT_2: StyleTemplates.LIST(TableColors.orange),
        LIST_TABLE_1_LIGHT_ACCENT_3: StyleTemplates.LIST(TableColors.yellow),
        LIST_TABLE_1_LIGHT_ACCENT_4: StyleTemplates.LIST(TableColors.red),
        LIST_TABLE_1_LIGHT_ACCENT_5: StyleTemplates.LIST(TableColors.purple),
        LIST_TABLE_1_LIGHT_ACCENT_6: StyleTemplates.LIST(TableColors.green),
        LIST_TABLE_2: StyleTemplates.LIST_WITH_HEADER(TableColors.black),
        LIST_TABLE_2_ACCENT_1: StyleTemplates.LIST_WITH_HEADER(TableColors.blue),
        LIST_TABLE_2_ACCENT_2: StyleTemplates.LIST_WITH_HEADER(TableColors.orange),
        LIST_TABLE_2_ACCENT_3: StyleTemplates.LIST_WITH_HEADER(TableColors.yellow),
        LIST_TABLE_2_ACCENT_4: StyleTemplates.LIST_WITH_HEADER(TableColors.red),
        LIST_TABLE_2_ACCENT_5: StyleTemplates.LIST_WITH_HEADER(TableColors.purple),
        LIST_TABLE_2_ACCENT_6: StyleTemplates.LIST_WITH_HEADER(TableColors.green),
        LIST_TABLE_3: StyleTemplates.LIST_SPECIAL(TableColors.black),
        LIST_TABLE_3_ACCENT_1: StyleTemplates.LIST_SPECIAL(TableColors.blue),
        LIST_TABLE_3_ACCENT_2: StyleTemplates.LIST_SPECIAL(TableColors.orange),
        LIST_TABLE_3_ACCENT_3: StyleTemplates.LIST_SPECIAL(TableColors.yellow),
        LIST_TABLE_3_ACCENT_4: StyleTemplates.LIST_SPECIAL(TableColors.red),
        LIST_TABLE_3_ACCENT_5: StyleTemplates.LIST_SPECIAL(TableColors.purple),
        LIST_TABLE_3_ACCENT_6: StyleTemplates.LIST_SPECIAL(TableColors.green),
    };
}

export const formatTableButton: RibbonButton<'ribbonButtonTableFormat'> = {
    key: 'ribbonButtonTableFormat',
    iconName: 'TableComputed',
    unlocalizedText: 'Format Table',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            TABLE_GRID: 'Table Grid',
            TABLE_GRID_LIGHT: 'Table Grid Light',
            PLAIN_TABLE_1: 'Plain Table 1',
            PLAIN_TABLE_2: 'Plain Table 2',
            PLAIN_TABLE_3: 'Plain Table 3',
            PLAIN_TABLE_4: 'Plain Table 4',
            PLAIN_TABLE_5: 'Plain Table 5',
            GRID_TABLE_1_LIGHT: 'Grid Table 1 Light',
            GRID_TABLE_1_LIGHT_ACCENT_1: 'Grid Table 1 Light - Accent 1',
            GRID_TABLE_1_LIGHT_ACCENT_2: 'Grid Table 1 Light - Accent 2',
            GRID_TABLE_1_LIGHT_ACCENT_3: 'Grid Table 1 Light - Accent 3',
            GRID_TABLE_1_LIGHT_ACCENT_4: 'Grid Table 1 Light - Accent 4',
            GRID_TABLE_1_LIGHT_ACCENT_5: 'Grid Table 1 Light - Accent 5',
            GRID_TABLE_1_LIGHT_ACCENT_6: 'Grid Table 1 Light - Accent 6',
            GRID_TABLE_2: 'Grid Table 2',
            GRID_TABLE_2_ACCENT_1: 'Grid Table 2 - Accent 1',
            GRID_TABLE_2_ACCENT_2: 'Grid Table 2 - Accent 2',
            GRID_TABLE_2_ACCENT_3: 'Grid Table 2 - Accent 3',
            GRID_TABLE_2_ACCENT_4: 'Grid Table 2 - Accent 4',
            GRID_TABLE_2_ACCENT_5: 'Grid Table 2 - Accent 5',
            GRID_TABLE_2_ACCENT_6: 'Grid Table 2 - Accent 6',
            GRID_TABLE_3: 'Grid Table 3',
            GRID_TABLE_3_ACCENT_1: 'Grid Table 3 - Accent 1',
            GRID_TABLE_3_ACCENT_2: 'Grid Table 3 - Accent 2',
            GRID_TABLE_3_ACCENT_3: 'Grid Table 3 - Accent 3',
            GRID_TABLE_3_ACCENT_4: 'Grid Table 3 - Accent 4',
            GRID_TABLE_3_ACCENT_5: 'Grid Table 3 - Accent 5',
            GRID_TABLE_3_ACCENT_6: 'Grid Table 3 - Accent 6',
            LIST_TABLE_1_LIGHT: 'List Table 1 Light',
            LIST_TABLE_1_LIGHT_ACCENT_1: 'List Table 1 Light - Accent 1',
            LIST_TABLE_1_LIGHT_ACCENT_2: 'List Table 1 Light - Accent 2',
            LIST_TABLE_1_LIGHT_ACCENT_3: 'List Table 1 Light - Accent 3',
            LIST_TABLE_1_LIGHT_ACCENT_4: 'List Table 1 Light - Accent 4',
            LIST_TABLE_1_LIGHT_ACCENT_5: 'List Table 1 Light - Accent 5',
            LIST_TABLE_1_LIGHT_ACCENT_6: 'List Table 1 Light - Accent 6',
            LIST_TABLE_2: 'List Table 2',
            LIST_TABLE_2_ACCENT_1: 'List Table 2 - Accent 1',
            LIST_TABLE_2_ACCENT_2: 'List Table 2 - Accent 2',
            LIST_TABLE_2_ACCENT_3: 'List Table 2 - Accent 3',
            LIST_TABLE_2_ACCENT_4: 'List Table 2 - Accent 4',
            LIST_TABLE_2_ACCENT_5: 'List Table 2 - Accent 5',
            LIST_TABLE_2_ACCENT_6: 'List Table 2 - Accent 6',
            LIST_TABLE_3: 'List Table 3',
            LIST_TABLE_3_ACCENT_1: 'List Table 3 - Accent 1',
            LIST_TABLE_3_ACCENT_2: 'List Table 3 - Accent 2',
            LIST_TABLE_3_ACCENT_3: 'List Table 3 - Accent 3',
            LIST_TABLE_3_ACCENT_4: 'List Table 3 - Accent 4',
            LIST_TABLE_3_ACCENT_5: 'List Table 3 - Accent 5',
            LIST_TABLE_3_ACCENT_6: 'List Table 3 - Accent 6',
        },
    },
    onClick: (editor, key) => {
        const format = getPredefinedStyles()[key];

        if (format) {
            formatTable(editor, format);
        }
    },
};
