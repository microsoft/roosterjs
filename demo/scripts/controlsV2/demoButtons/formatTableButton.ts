import { formatTable } from 'roosterjs-content-model-api';
import { TableBorderFormat } from 'roosterjs-content-model-dom';
import { TableMetadataFormat } from 'roosterjs-content-model-types';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const PREDEFINED_STYLES: Record<
    string,
    (color?: string, lightColor?: string) => TableMetadataFormat
> = {
    DEFAULT: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    DEFAULT_WITH_BACKGROUND_COLOR: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    GRID_WITHOUT_BORDER: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.NoSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    LIST: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            null /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    BANDED_ROWS_FIRST_COLUMN_NO_BORDER: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.FirstColumnHeaderExternal /** tableBorderFormat */,
            '#B0B0B0' /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    EXTERNAL: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.ListWithSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    NO_HEADER_VERTICAL: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.NoHeaderBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    ESPECIAL_TYPE_1: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.EspecialType1 /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    ESPECIAL_TYPE_2: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.EspecialType2 /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    ESPECIAL_TYPE_3: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.EspecialType3 /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            color /** headerRowColor */
        ),
    CLEAR: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Clear /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            color /** headerRowColor */
        ),
};

export function createTableFormat(
    topBorder?: string,
    bottomBorder?: string,
    verticalBorder?: string,
    bandedRows?: boolean,
    bandedColumns?: boolean,
    headerRow?: boolean,
    firstColumn?: boolean,
    borderFormat?: number,
    bgColorEven?: string,
    bgColorOdd?: string,
    headerRowColor?: string
): TableMetadataFormat {
    return {
        topBorderColor: topBorder,
        bottomBorderColor: bottomBorder,
        verticalBorderColor: verticalBorder,
        hasBandedRows: bandedRows,
        bgColorEven: bgColorEven,
        bgColorOdd: bgColorOdd,
        hasBandedColumns: bandedColumns,
        hasHeaderRow: headerRow,
        headerRowColor: headerRowColor,
        hasFirstColumn: firstColumn,
        tableBorderFormat: borderFormat,
    };
}

export const formatTableButton: RibbonButton<'ribbonButtonTableFormat'> = {
    key: 'ribbonButtonTableFormat',
    iconName: 'TableComputed',
    unlocalizedText: 'Format Table',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            DEFAULT: 'Default',
            DEFAULT_WITH_BACKGROUND_COLOR: 'Default with background color',
            GRID_WITHOUT_BORDER: 'Gride without border',
            LIST: 'list',
            BANDED_ROWS_FIRST_COLUMN_NO_BORDER: 'Banded rows first column no border',
            EXTERNAL: 'External',
            NO_HEADER_VERTICAL: 'No header vertical',
            ESPECIAL_TYPE_1: 'Especial type 1',
            ESPECIAL_TYPE_2: 'Especial type 2',
            ESPECIAL_TYPE_3: 'Especial type 3',
            CLEAR: 'Clear',
        },
    },
    onClick: (editor, key) => {
        const format = PREDEFINED_STYLES[key]?.('#ABABAB', '#ABABAB20');

        if (format) {
            formatTable(editor, format);
        }
    },
};
