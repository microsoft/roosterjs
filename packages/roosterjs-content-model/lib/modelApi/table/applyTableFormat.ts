import { BorderIndex, combineBorderValue, extractBorderValues } from '../../domUtils/borderValues';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';

const DEFAULT_FORMAT: Required<TableMetadataFormat> = {
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: TableBorderFormat.DEFAULT,
};

/**
 * @internal
 */
export function applyTableFormat(
    table: ContentModelTable,
    newFormat?: TableMetadataFormat,
    keepCellShade?: boolean
) {
    const { cells, format } = table;
    const effectiveMetadata = {
        ...DEFAULT_FORMAT,
        ...format,
        ...(newFormat || {}),
    };

    Object.assign(format, effectiveMetadata);

    if (!keepCellShade) {
        deleteCellBackgroundColorOverride(cells, effectiveMetadata);
    }

    formatBorders(cells, effectiveMetadata);
    formatBackgroundColors(cells, effectiveMetadata);
    setFirstColumnFormat(cells, effectiveMetadata);
    setHeaderRowFormat(cells, effectiveMetadata);
}

function deleteCellBackgroundColorOverride(
    cells: ContentModelTableCell[][],
    format: TableMetadataFormat
) {
    cells.forEach(row => {
        row.forEach(cell => {
            delete cell.format.bgColorOverride;
        });
    });
}

type ShouldUseTransparentBorder = (indexProp: {
    firstRow: boolean;
    lastRow: boolean;
    firstColumn: boolean;
    lastColumn: boolean;
}) => [boolean, boolean, boolean, boolean];

const BorderFormatters: Record<TableBorderFormat, ShouldUseTransparentBorder> = {
    [TableBorderFormat.DEFAULT]: _ => [false, false, false, false],
    [TableBorderFormat.LIST_WITH_SIDE_BORDERS]: ({ lastColumn, firstColumn }) => [
        false,
        !lastColumn,
        false,
        !firstColumn,
    ],
    [TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL]: ({
        firstColumn,
        firstRow,
        lastColumn,
        lastRow,
    }) => [
        !firstRow,
        (!lastColumn && !firstColumn) || (firstColumn && firstRow),
        !lastRow && !firstRow,
        !firstColumn,
    ],
    [TableBorderFormat.NO_HEADER_BORDERS]: ({ firstRow, firstColumn, lastColumn }) => [
        firstRow,
        firstRow || lastColumn,
        false,
        firstRow || firstColumn,
    ],
    [TableBorderFormat.NO_SIDE_BORDERS]: ({ firstColumn, lastColumn }) => [
        false,
        lastColumn,
        false,
        firstColumn,
    ],
    [TableBorderFormat.ESPECIAL_TYPE_1]: ({ firstRow, firstColumn }) => [
        firstColumn && !firstRow,
        firstRow,
        firstColumn && !firstRow,
        firstRow && !firstColumn,
    ],
    [TableBorderFormat.ESPECIAL_TYPE_2]: ({ firstRow, firstColumn }) => [
        !firstRow,
        firstRow || !firstColumn,
        !firstRow,
        !firstColumn,
    ],
    [TableBorderFormat.ESPECIAL_TYPE_3]: ({ firstColumn, firstRow }) => [
        true,
        firstRow || !firstColumn,
        !firstRow,
        true,
    ],
    [TableBorderFormat.CLEAR]: () => [true, true, true, true],
};

function formatBorders(cells: ContentModelTableCell[][], format: TableMetadataFormat) {
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const transparentBorderMatrix = BorderFormatters[
                format.tableBorderFormat as TableBorderFormat
            ]({
                firstRow: rowIndex === 0,
                lastRow: rowIndex === cells.length - 1,
                firstColumn: cellIndex === 0,
                lastColumn: cellIndex === row.length - 1,
            });

            // Set to default value first
            cell.format.borderStyle = 'solid';
            cell.format.borderWidth = '1px';
            cell.format.borderColor = combineBorderValue(
                [
                    getBorder(format.topBorderColor, transparentBorderMatrix[0]),
                    getBorder(format.verticalBorderColor, transparentBorderMatrix[1]),
                    getBorder(format.bottomBorderColor, transparentBorderMatrix[2]),
                    getBorder(format.verticalBorderColor, transparentBorderMatrix[3]),
                ],
                'transparent'
            );
        });
    });
}

function getBorder(style: string | null | undefined, alwaysUseTransparent: boolean) {
    return (!alwaysUseTransparent && style) || '';
}

function formatBackgroundColors(cells: ContentModelTableCell[][], format: TableMetadataFormat) {
    const { hasBandedRows, hasBandedColumns, bgColorOdd, bgColorEven } = format;
    const shouldColorWholeTable = !hasBandedRows && bgColorOdd === bgColorEven;

    cells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const color = hasBandedColumns
                ? colIndex % 2 === 0
                    ? format.bgColorEven
                    : format.bgColorOdd
                : hasBandedRows
                ? rowIndex % 2 === 0
                    ? format.bgColorEven
                    : format.bgColorOdd
                : shouldColorWholeTable
                ? format.bgColorOdd
                : null;

            if (color && !cell.format.bgColorOverride) {
                cell.format.backgroundColor = color;

                // TODO: format text color
            } else {
                delete cell.format.backgroundColor;
            }
        });
    });
}

function setFirstColumnFormat(
    cells: ContentModelTableCell[][],
    format: Partial<TableMetadataFormat>
) {
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (format.hasFirstColumn && cellIndex === 0) {
                cell.isHeader = true;
                const borders = extractBorderValues(cell.format.borderColor!);

                if (rowIndex !== 0 && !cell.format.bgColorOverride) {
                    borders[BorderIndex.Top] = 'transparent';
                    delete cell.format.backgroundColor;
                    // TODO: Set text color
                }

                if (rowIndex !== cells.length - 1 && rowIndex !== 0) {
                    borders[BorderIndex.Bottom] = 'transparent';
                }

                cell.format.borderColor = combineBorderValue(borders, 'transparent');
            } else {
                cell.isHeader = false;
            }
        });
    });
}

function setHeaderRowFormat(cells: ContentModelTableCell[][], format: TableMetadataFormat) {
    cells[0]?.forEach(cell => {
        cell.isHeader = format.hasHeaderRow;

        if (format.hasHeaderRow && format.headerRowColor) {
            if (!cell.format.bgColorOverride) {
                cell.format.backgroundColor = format.headerRowColor;

                // TODO: Set text color
            }

            const borders = extractBorderValues(cell.format.borderColor!);

            borders[BorderIndex.Top] = format.headerRowColor;
            borders[BorderIndex.Right] = format.headerRowColor;
            borders[BorderIndex.Left] = format.headerRowColor;

            cell.format.borderColor = combineBorderValue(borders, 'transparent');
        }
    });
}
