import { BorderKeys } from 'roosterjs-content-model-dom';
import { combineBorderValue, extractBorderValues } from '../../domUtils/borderValues';
import { setTableCellBackgroundColor } from './setTableCellBackgroundColor';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import { updateTableMetadata } from '../../domUtils/metadata/updateTableMetadata';
import {
    BorderFormat,
    ContentModelTable,
    ContentModelTableRow,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

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
    verticalAlign: null,
};

type MetaOverrides = {
    bgColorOverrides: boolean[][];
    vAlignOverrides: boolean[][];
};

/**
 * @internal
 */
export function applyTableFormat(
    table: ContentModelTable,
    newFormat?: TableMetadataFormat,
    keepCellShade?: boolean
) {
    const { rows } = table;

    updateTableMetadata(table, format => {
        const effectiveMetadata = {
            ...DEFAULT_FORMAT,
            ...format,
            ...(newFormat || {}),
        };

        const metaOverrides: MetaOverrides = updateOverrides(rows, !keepCellShade);

        delete table.cachedElement;

        clearCache(rows);
        formatCells(rows, effectiveMetadata, metaOverrides);
        setFirstColumnFormat(rows, effectiveMetadata, metaOverrides);
        setHeaderRowFormat(rows, effectiveMetadata, metaOverrides);
        return effectiveMetadata;
    });
}

function clearCache(rows: ContentModelTableRow[]) {
    rows.forEach(row => {
        row.cells.forEach(cell => {
            delete cell.cachedElement;
        });

        delete row.cachedElement;
    });
}

function updateOverrides(rows: ContentModelTableRow[], removeCellShade: boolean): MetaOverrides {
    const overrides: MetaOverrides = { bgColorOverrides: [], vAlignOverrides: [] };

    rows.forEach(row => {
        const bgColorOverrides: boolean[] = [];
        const vAlignOverrides: boolean[] = [];

        overrides.bgColorOverrides.push(bgColorOverrides);
        overrides.vAlignOverrides.push(vAlignOverrides);

        row.cells.forEach(cell => {
            updateTableCellMetadata(cell, metadata => {
                if (metadata && removeCellShade) {
                    bgColorOverrides.push(false);
                    delete metadata.bgColorOverride;
                } else {
                    bgColorOverrides.push(!!metadata?.bgColorOverride);
                }
                vAlignOverrides.push(!!metadata?.vAlignOverride);

                return metadata;
            });
        });
    });

    return overrides;
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

/*
 * Apply vertical align, borders, and background color to all cells in the table
 */
function formatCells(
    rows: ContentModelTableRow[],
    format: TableMetadataFormat,
    metaOverrides: MetaOverrides
) {
    const { hasBandedRows, hasBandedColumns, bgColorOdd, bgColorEven } = format;

    rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, colIndex) => {
            // Format Borders
            const transparentBorderMatrix = BorderFormatters[
                format.tableBorderFormat as TableBorderFormat
            ]({
                firstRow: rowIndex === 0,
                lastRow: rowIndex === rows.length - 1,
                firstColumn: colIndex === 0,
                lastColumn: colIndex === row.cells.length - 1,
            });

            const formatColor = [
                format.topBorderColor,
                format.verticalBorderColor,
                format.bottomBorderColor,
                format.verticalBorderColor,
            ];

            transparentBorderMatrix.forEach((alwaysUseTransparent, i) => {
                const borderColor = (!alwaysUseTransparent && formatColor[i]) || '';

                cell.format[BorderKeys[i]] = combineBorderValue({
                    style: getBorderStyleFromColor(borderColor),
                    width: '1px',
                    color: borderColor,
                });
            });

            // Format Background Color
            if (!metaOverrides.bgColorOverrides[rowIndex][colIndex]) {
                const color =
                    hasBandedRows || hasBandedColumns
                        ? (hasBandedColumns && colIndex % 2 != 0) ||
                          (hasBandedRows && rowIndex % 2 != 0)
                            ? bgColorOdd
                            : bgColorEven
                        : bgColorEven; /* bgColorEven is the default color */

                setTableCellBackgroundColor(
                    cell,
                    color,
                    false /*isColorOverride*/,
                    true /*applyToSegments*/
                );
            }

            // Format Vertical Align
            if (format.verticalAlign && !metaOverrides.vAlignOverrides[rowIndex][colIndex]) {
                cell.format.verticalAlign = format.verticalAlign;
            }
        });
    });
}

function setFirstColumnFormat(
    rows: ContentModelTableRow[],
    format: Partial<TableMetadataFormat>,
    metaOverrides: MetaOverrides
) {
    rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, cellIndex) => {
            if (format.hasFirstColumn && cellIndex === 0) {
                cell.isHeader = true;

                if (rowIndex !== 0 && !metaOverrides.bgColorOverrides[rowIndex][cellIndex]) {
                    setBorderColor(cell.format, 'borderTop');
                    setTableCellBackgroundColor(
                        cell,
                        null /*color*/,
                        false /*isColorOverride*/,
                        true /*applyToSegments*/
                    );
                }

                if (rowIndex !== rows.length - 1 && rowIndex !== 0) {
                    setBorderColor(cell.format, 'borderBottom');
                }
            } else {
                cell.isHeader = false;
            }
        });
    });
}

function setHeaderRowFormat(
    rows: ContentModelTableRow[],
    format: TableMetadataFormat,
    metaOverrides: MetaOverrides
) {
    const rowIndex = 0;

    rows[rowIndex]?.cells.forEach((cell, cellIndex) => {
        cell.isHeader = format.hasHeaderRow;

        if (format.hasHeaderRow && format.headerRowColor) {
            if (!metaOverrides.bgColorOverrides[rowIndex][cellIndex]) {
                setTableCellBackgroundColor(
                    cell,
                    format.headerRowColor,
                    false /*isColorOverride*/,
                    true /*applyToSegments*/
                );
            }

            setBorderColor(cell.format, 'borderTop', format.headerRowColor);
            setBorderColor(cell.format, 'borderRight', format.headerRowColor);
            setBorderColor(cell.format, 'borderLeft', format.headerRowColor);
        }
    });
}

function setBorderColor(format: BorderFormat, key: keyof BorderFormat, value?: string) {
    const border = extractBorderValues(format[key]);
    border.color = value || '';
    border.style = getBorderStyleFromColor(border.color);
    format[key] = combineBorderValue(border);
}

function getBorderStyleFromColor(color?: string): string {
    return !color || color == 'transparent' ? 'none' : 'solid';
}
