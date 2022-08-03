import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { TableBorderFormat, TableFormat } from 'roosterjs-editor-types';

const DEFAULT_FORMAT: Required<TableFormat> = {
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
    keepCellShade: false,
};

/**
 * @internal
 */
export function applyTableFormat(table: ContentModelTable, metadata?: TableFormat) {
    const { cells, format } = table;
    const effectiveMetadata = {
        ...DEFAULT_FORMAT,
        ...(format.metadata || {}),
        ...(metadata || {}),
    };

    format.metadata = effectiveMetadata;

    deleteCellBackgroundColorOverride(cells, effectiveMetadata);
    formatBorders(cells, effectiveMetadata);
    formatBackgroundColors(cells, effectiveMetadata);
    setFirstColumnFormat(cells, effectiveMetadata);
    setHeaderRowFormat(cells, effectiveMetadata);
}

function deleteCellBackgroundColorOverride(cells: ContentModelTableCell[][], format: TableFormat) {
    if (!format || !format.keepCellShade) {
        cells.forEach(row => {
            row.forEach(cell => {
                delete cell.format.metadata?.bgColorOverride;
            });
        });
    }
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

function formatBorders(cells: ContentModelTableCell[][], format: TableFormat) {
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
            cell.format.borderStyle = ['solid', 'solid', 'solid', 'solid'];
            cell.format.borderWidth = ['1px', '1px', '1px', '1px'];
            cell.format.borderColor = [
                getBorderStyle(format.topBorderColor, transparentBorderMatrix[0]),
                getBorderStyle(format.verticalBorderColor, transparentBorderMatrix[1]),
                getBorderStyle(format.bottomBorderColor, transparentBorderMatrix[2]),
                getBorderStyle(format.verticalBorderColor, transparentBorderMatrix[3]),
            ];
        });
    });
}

function getBorderStyle(style: string | null | undefined, alwaysUseTransparent: boolean) {
    return (!alwaysUseTransparent && style) || 'transparent';
}

function formatBackgroundColors(cells: ContentModelTableCell[][], format: TableFormat) {
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

            if (color && !cell.format.metadata?.bgColorOverride) {
                cell.format.backgroundColor = color;

                // TODO: format text color
            } else {
                delete cell.format.backgroundColor;
            }
        });
    });
}

const Top = 0;
const Right = 1;
const Bottom = 2;
const Left = 3;

function setFirstColumnFormat(cells: ContentModelTableCell[][], format: Partial<TableFormat>) {
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (format.hasFirstColumn && cellIndex === 0) {
                cell.isHeader = true;

                if (rowIndex !== 0 && !cell.format.metadata?.bgColorOverride) {
                    cell.format.borderColor![Top] = 'transparent';
                    delete cell.format.backgroundColor;
                    // TODO: Set text color
                }

                if (rowIndex !== cells.length - 1 && rowIndex !== 0) {
                    cell.format.borderColor![Bottom] = 'transparent';
                }
            } else {
                cell.isHeader = false;
            }
        });
    });
}

function setHeaderRowFormat(cells: ContentModelTableCell[][], format: TableFormat) {
    cells[0]?.forEach(cell => {
        cell.isHeader = format.hasHeaderRow;

        if (format.hasHeaderRow && format.headerRowColor) {
            if (!cell.format.metadata?.bgColorOverride) {
                cell.format.backgroundColor = format.headerRowColor;

                // TODO: Set text color
            }

            cell.format.borderColor![Top] = format.headerRowColor;
            cell.format.borderColor![Right] = format.headerRowColor;
            cell.format.borderColor![Left] = format.headerRowColor;
        }
    });
}
