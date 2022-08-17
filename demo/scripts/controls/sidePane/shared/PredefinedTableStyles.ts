import { TableBorderFormat, TableFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from 'roosterjs-content-model';

export const PREDEFINED_STYLES: Record<
    string,
    (color?: string, lightColor?: string) => TableFormat & TableMetadataFormat
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
            TableBorderFormat.DEFAULT /** tableBorderFormat */,
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
            TableBorderFormat.DEFAULT /** tableBorderFormat */,
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
            TableBorderFormat.NO_SIDE_BORDERS /** tableBorderFormat */,
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
            TableBorderFormat.DEFAULT /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */
        ),
    BANDED_ROWS_FIRST_COLUMN_NO_BORDER: (color, lightColor) =>
        createTableFormat(
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL /** tableBorderFormat */,
            null /** bgColorEven */,
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
            TableBorderFormat.LIST_WITH_SIDE_BORDERS /** tableBorderFormat */,
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
            TableBorderFormat.NO_HEADER_BORDERS /** tableBorderFormat */,
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
            TableBorderFormat.ESPECIAL_TYPE_1 /** tableBorderFormat */,
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
            TableBorderFormat.ESPECIAL_TYPE_2 /** tableBorderFormat */,
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
            TableBorderFormat.ESPECIAL_TYPE_3 /** tableBorderFormat */,
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
            TableBorderFormat.CLEAR /** tableBorderFormat */,
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
    borderFormat?: TableBorderFormat,
    bgColorEven?: string,
    bgColorOdd?: string,
    headerRowColor?: string
): TableFormat & TableMetadataFormat {
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
        keepCellShade: false,
    };
}
