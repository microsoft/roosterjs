import changeElementTag from '../utils/changeElementTag';
import setColor from '../utils/setColor';
import { DarkColorHandler, TableBorderFormat, TableFormat, VCell } from 'roosterjs-editor-types';
import { getTableCellMetadata } from './tableCellInfo';
const TRANSPARENT = 'transparent';
const TABLE_CELL_TAG_NAME = 'TD';
const TABLE_HEADER_TAG_NAME = 'TH';

/**
 * @internal
 * Apply the given table format to this virtual table
 * @param format Table format to apply
 * @param darkColorHandler An object to handle dark background colors, if not passed the cell background color will not be set
 */
export default function applyTableFormat(
    table: HTMLTableElement,
    cells: VCell[][],
    format: Required<TableFormat>,
    darkColorHandler?: DarkColorHandler | null
) {
    if (!format) {
        return;
    }
    table.style.borderCollapse = 'collapse';
    setBordersType(cells, format);
    setCellColor(cells, format, darkColorHandler);
    setFirstColumnFormat(cells, format);
    setHeaderRowFormat(cells, format, darkColorHandler);
}

/**
 * Check if the cell has shade
 * @param cell
 * @returns
 */
function hasCellShade(cell: VCell) {
    if (!cell.td) {
        return false;
    }

    return !!getTableCellMetadata(cell.td)?.bgColorOverride;
}

/**
 * Set color to the table
 * @param format the format that must be applied
 * @param darkColorHandler An object to handle dark background colors, if not passed the cell background color will not be set
 */
function setCellColor(
    cells: VCell[][],
    format: TableFormat,
    darkColorHandler?: DarkColorHandler | null
) {
    const color = (index: number) => (index % 2 === 0 ? format.bgColorEven : format.bgColorOdd);
    const { hasBandedRows, hasBandedColumns, bgColorOdd, bgColorEven } = format;
    const shouldColorWholeTable = !hasBandedRows && bgColorOdd === bgColorEven ? true : false;
    cells.forEach((row, index) => {
        row.forEach(cell => {
            if (cell.td && !hasCellShade(cell)) {
                if (hasBandedRows) {
                    const backgroundColor = color(index);
                    setColor(
                        cell.td,
                        backgroundColor || TRANSPARENT,
                        true /** isBackgroundColor*/,
                        undefined /** isDarkMode **/,
                        true /** shouldAdaptFontColor */,
                        darkColorHandler
                    );
                } else if (shouldColorWholeTable) {
                    setColor(
                        cell.td,
                        format.bgColorOdd || TRANSPARENT,
                        true /** isBackgroundColor*/,
                        undefined /** isDarkMode **/,
                        true /** shouldAdaptFontColor */,
                        darkColorHandler
                    );
                } else {
                    setColor(
                        cell.td,
                        TRANSPARENT,
                        true /** isBackgroundColor*/,
                        undefined /** isDarkMode **/,
                        true /** shouldAdaptFontColor */,
                        darkColorHandler
                    );
                }
            }
        });
    });
    if (hasBandedColumns) {
        cells.forEach(row => {
            row.forEach((cell, index) => {
                const backgroundColor = color(index);
                if (cell.td && backgroundColor && !hasCellShade(cell)) {
                    setColor(
                        cell.td,
                        backgroundColor,
                        true /** isBackgroundColor*/,
                        undefined /** isDarkMode **/,
                        true /** shouldAdaptFontColor */,
                        darkColorHandler
                    );
                }
            });
        });
    }
}

/**
 * Set color to borders of an table
 * @param format
 * @returns
 */
function setBorderColors(td: HTMLTableCellElement, format: Partial<TableFormat>) {
    td.style.borderTop = getBorderStyle(format.topBorderColor);
    td.style.borderLeft = getBorderStyle(format.verticalBorderColor);
    td.style.borderRight = getBorderStyle(format.verticalBorderColor);
    td.style.borderBottom = getBorderStyle(format.bottomBorderColor);
}

/**
 * Format the border type
 * @returns
 */
function formatBorders(
    format: TableFormat,
    td: HTMLTableCellElement,
    isFirstRow: boolean,
    isLastRow: boolean,
    isFirstColumn: boolean,
    isLastColumn: boolean
) {
    setBorderColors(td, format);
    switch (format.tableBorderFormat) {
        case TableBorderFormat.DEFAULT:
            return;
        case TableBorderFormat.LIST_WITH_SIDE_BORDERS:
            if (!isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (!isLastColumn) {
                td.style.borderRightColor = TRANSPARENT;
            }

            break;
        case TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL:
            if (!isFirstRow) {
                td.style.borderTopColor = TRANSPARENT;
            }

            if (!isLastRow && !isFirstRow) {
                td.style.borderBottomColor = TRANSPARENT;
            }
            if (!isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (!isLastColumn && !isFirstColumn) {
                td.style.borderRightColor = TRANSPARENT;
            }
            if (isFirstColumn && isFirstRow) {
                td.style.borderRightColor = TRANSPARENT;
            }

            break;
        case TableBorderFormat.NO_HEADER_BORDERS:
            if (isFirstRow) {
                td.style.borderTopColor = TRANSPARENT;
                td.style.borderRightColor = TRANSPARENT;
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (isLastColumn) {
                td.style.borderRightColor = TRANSPARENT;
            }
            break;
        case TableBorderFormat.NO_SIDE_BORDERS:
            if (isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (isLastColumn) {
                td.style.borderRightColor = TRANSPARENT;
            }
            break;
        case TableBorderFormat.ESPECIAL_TYPE_1:
            if (isFirstRow) {
                td.style.borderRightColor = TRANSPARENT;
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (isFirstColumn) {
                td.style.borderBottomColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
            }
            if (isFirstRow && isFirstColumn) {
                td.style.borderLeftColor = format.verticalBorderColor || TRANSPARENT;
                td.style.borderBottomColor = format.bottomBorderColor || TRANSPARENT;
                td.style.borderTopColor = format.topBorderColor || TRANSPARENT;
            }
            break;
        case TableBorderFormat.ESPECIAL_TYPE_2:
            if (isFirstRow) {
                td.style.borderRightColor = TRANSPARENT;
                td.style.borderLeftColor = TRANSPARENT;
            }
            if (isFirstColumn) {
                td.style.borderBottomColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
            }
            if (isFirstRow && isFirstColumn) {
                td.style.borderLeftColor = format.verticalBorderColor || TRANSPARENT;
                td.style.borderBottomColor = format.bottomBorderColor || TRANSPARENT;
                td.style.borderTopColor = format.topBorderColor || TRANSPARENT;
            }
            if (!isFirstRow && !isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
                td.style.borderBottomColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
                td.style.borderRightColor = TRANSPARENT;
            }

            break;
        case TableBorderFormat.ESPECIAL_TYPE_3:
            if (isFirstRow) {
                td.style.borderLeftColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
                td.style.borderRightColor = TRANSPARENT;
            }
            if (isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
                td.style.borderBottomColor = TRANSPARENT;
            }
            if (!isFirstRow && !isFirstColumn) {
                td.style.borderLeftColor = TRANSPARENT;
                td.style.borderBottomColor = TRANSPARENT;
                td.style.borderTopColor = TRANSPARENT;
                td.style.borderRightColor = TRANSPARENT;
            }
            if (isFirstRow && isFirstColumn) {
                td.style.borderBottomColor = format.bottomBorderColor || TRANSPARENT;
            }
            break;
    }
}

/**
 * Organize the borders of table according to a border type
 * @param format
 * @returns
 */
function setBordersType(cells: VCell[][], format: TableFormat) {
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell.td) {
                formatBorders(
                    format,
                    cell.td,
                    rowIndex === 0,
                    rowIndex === cells.length - 1,
                    cellIndex === 0,
                    cellIndex === row.length - 1
                );
            }
        });
    });
}

/**
 * Apply custom design to the first table column
 * @param format
 * @returns
 */
function setFirstColumnFormat(cells: VCell[][], format: Partial<TableFormat>) {
    if (!format.hasFirstColumn) {
        cells.forEach(row => {
            row.forEach((cell, cellIndex) => {
                if (cell.td && cellIndex === 0) {
                    cell.td = changeElementTag(
                        cell.td,
                        TABLE_CELL_TAG_NAME
                    ) as HTMLTableCellElement;
                    cell.td.scope = '';
                }
            });
        });
        return;
    }
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell.td && cellIndex === 0) {
                if (rowIndex !== 0 && !hasCellShade(cell)) {
                    cell.td.style.borderTopColor = TRANSPARENT;
                    setColor(
                        cell.td,
                        TRANSPARENT,
                        true /** isBackgroundColor*/,
                        undefined /** isDarkMode **/,
                        true /** shouldAdaptFontColor */
                    );
                }
                if (rowIndex !== cells.length - 1 && rowIndex !== 0) {
                    cell.td.style.borderBottomColor = TRANSPARENT;
                }
                cell.td = changeElementTag(cell.td, TABLE_HEADER_TAG_NAME) as HTMLTableCellElement;
                cell.td.scope = 'col';
            }
        });
    });
}

/**
 * Apply custom design to the Header Row
 * @param format
 * @param darkColorHandler An object to handle dark background colors, if not passed the cell background color will not be set
 * @returns
 */
function setHeaderRowFormat(
    cells: VCell[][],
    format: TableFormat,
    darkColorHandler?: DarkColorHandler | null
) {
    if (!format.hasHeaderRow) {
        cells[0]?.forEach(cell => {
            if (cell.td) {
                cell.td = changeElementTag(cell.td, TABLE_CELL_TAG_NAME) as HTMLTableCellElement;
                cell.td.scope = '';
            }
        });
        return;
    }
    cells[0]?.forEach(cell => {
        if (cell.td && format.headerRowColor) {
            if (!hasCellShade(cell)) {
                setColor(
                    cell.td,
                    format.headerRowColor,
                    true /** isBackgroundColor*/,
                    undefined /** isDarkMode **/,
                    true /** shouldAdaptFontColor */,
                    darkColorHandler
                );
            }
            cell.td.style.borderRightColor = format.headerRowColor;
            cell.td.style.borderLeftColor = format.headerRowColor;
            cell.td.style.borderTopColor = format.headerRowColor;
            cell.td = changeElementTag(cell.td, TABLE_HEADER_TAG_NAME) as HTMLTableCellElement;
            cell.td.scope = 'row';
        }
    });
}

function getBorderStyle(style?: string | null) {
    const color = style ? style : 'transparent';
    return 'solid 1px ' + color;
}
