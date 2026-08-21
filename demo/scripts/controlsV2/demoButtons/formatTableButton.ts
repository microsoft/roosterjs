import { formatTable } from 'roosterjs-content-model-api';
import { TableBorderFormat } from 'roosterjs-content-model-dom';
import { TableMetadataFormat, TableSpecialCellMetadataFormat } from 'roosterjs-content-model-types';
import type { RibbonButton } from 'roosterjs-react';

const PREDEFINED_STYLES: Record<
    string,
    (color?: string, lightColor?: string) => TableMetadataFormat
> = {
    /**
     * Table Grid:
     * - Regular cells: all borders, ½ pt, blue
     * - No special header, first column, or banding
     */
    TABLE_GRID: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),
    /**
     * Table Grid Light:
     * - Regular cells: all borders, ½ pt, light blue
     * - No special header, first column, or banding
     */
    TABLE_GRID_LIGHT: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            false /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * Plain Table 1:
     * - Regular cells: all borders, blue
     * - Header row:    bold
     * - First column:  bold
     * - Banded rows:   shading
     * - Banded columns: shading
     */
    PLAIN_TABLE_1: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            color /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * Plain Table 2:
     * - Regular cells: horizontal borders only (top/bottom), blue
     * - Header row:    bold
     * - First column:  border bottom
     * - Banded rows:   shading
     */
    PLAIN_TABLE_2: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.ListWithSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { borderBottomColor: color } /** firstColumnCustomStyles */
        ),

    /**
     * Plain Table 3:
     * - Regular cells: no borders
     * - Header row:    bold + border bottom
     * - First column:  border right
     * - Banded rows:   shading
     */
    PLAIN_TABLE_3: (color, lightColor) =>
        createTableFormat(
            null /** topBorder */,
            null /** bottomBorder */,
            null /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Clear /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            'transparent' /** headerRowColor */,
            { fontWeight: 'bold', borderBottomColor: color } /** headerRowCustomStyles */,
            { borderRightColor: color } /** firstColumnCustomStyles */
        ),

    /**
     * Plain Table 4:
     * - Regular cells: no borders
     * - Header row:    bold
     * - First column:  bold
     * - Banded rows + columns: shading
     */
    PLAIN_TABLE_4: (color, lightColor) =>
        createTableFormat(
            null /** topBorder */,
            null /** bottomBorder */,
            null /** verticalBorder */,
            true /** bandedRows */,
            true /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Clear /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * Plain Table 5:
     * - Regular cells: no borders
     * - Header row:    italic + border bottom
     * - First column:  border right
     * - Banded rows:   shading
     */
    PLAIN_TABLE_5: (color, lightColor) =>
        createTableFormat(
            null /** topBorder */,
            null /** bottomBorder */,
            null /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Clear /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            'transparent' /** headerRowColor */,
            { italic: true, borderBottomColor: color } /** headerRowCustomStyles */,
            {
                italic: true,
                borderRightColor: color,
                backgroundColor: 'transparent',
                textAlign: 'end',
            } /** firstColumnCustomStyles */
        ),

    /**
     * Grid Table 1 Light:
     * - Regular cells: all borders, blue
     * - Header row:    bold + border bottom (thick)
     * - First column:  bold
     * - Banded rows:   shading
     */
    GRID_TABLE_1_LIGHT: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold', borderBottomColor: color } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * Grid Table 2:
     * - Regular cells: borders except outside left/right
     * - Header row:    bold + border bottom (thick)
     * - First column:  bold
     * - Banded rows:   shading (except header)
     */
    GRID_TABLE_2: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.NoSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold', borderBottomColor: color } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * Grid Table 3:
     * - Regular cells: all borders, blue
     * - Header row:    bold + border bottom
     * - First column:  border bottom
     * - Banded rows:   shading
     */
    GRID_TABLE_3: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.Default /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold', borderBottomColor: color } /** headerRowCustomStyles */,
            { borderBottomColor: color } /** firstColumnCustomStyles */
        ),

    /**
     * List Table 1 Light:
     * - Regular cells: no borders
     * - Header row:    bold + border bottom
     * - Banded rows:   shading
     */
    LIST_TABLE_1_LIGHT: (color, lightColor) =>
        createTableFormat(
            null /** topBorder */,
            null /** bottomBorder */,
            null /** verticalBorder */,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.Clear /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold', borderBottomColor: color } /** headerRowCustomStyles */
        ),

    /**
     * List Table 2:
     * - Regular cells: horizontal borders only (top/bottom)
     * - Header row:    bold
     * - First column:  bold
     * - Banded rows + columns: shading
     */
    LIST_TABLE_2: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            true /** bandedRows */,
            true /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.ListWithSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** headerRowColor */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            { fontWeight: 'bold' } /** firstColumnCustomStyles */
        ),

    /**
     * List Table 3:
     * - Regular cells: outside borders only
     * - Header row:    bold + inverted (dark blue background)
     * - First column:  bold + top and bottom borders
     */
    LIST_TABLE_3: (color, lightColor) =>
        createTableFormat(
            color /** topBorder */,
            color /** bottomBorder */,
            color /** verticalBorder */,
            false /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.ListWithSideBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            null /** bgColorOdd */,
            color /** headerRowColor - dark blue inverted background */,
            { fontWeight: 'bold' } /** headerRowCustomStyles */,
            {
                fontWeight: 'bold',
                borderTopColor: color,
                borderBottomColor: color,
            } /** firstColumnCustomStyles */
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
    headerRowColor?: string,
    headerRowCustomStyles?: TableSpecialCellMetadataFormat,
    firstColumnCustomStyles?: TableSpecialCellMetadataFormat
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
        headerRowCustomStyles,
        firstColumnCustomStyles,
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
            GRID_TABLE_2: 'Grid Table 2',
            GRID_TABLE_3: 'Grid Table 3',
            LIST_TABLE_1_LIGHT: 'List Table 1 Light',
            LIST_TABLE_2: 'List Table 2',
            LIST_TABLE_3: 'List Table 3',
        },
    },
    onClick: (editor, key) => {
        const format = PREDEFINED_STYLES[key]?.('#ABABAB', '#ABABAB20');

        if (format) {
            formatTable(editor, format);
        }
    },
};
