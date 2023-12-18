import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import {
    extractBorderValues,
    getFirstSelectedTable,
    getSelectedCells,
    updateTableCellMetadata,
} from 'roosterjs-content-model-core';
import type {
    IStandaloneEditor,
    Border,
    ContentModelTable,
    ContentModelTableCell,
    BorderOperations,
    TableSelectionCoordinates,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Border positions
 */
type BorderPositions = 'borderTop' | 'borderBottom' | 'borderInlineStart' | 'borderInlineEnd';

/**
 * @internal
 * Perimeter of the table selection
 * Used to determine where to apply border to the cells adjacent to the selection.
 */
type Perimeter = {
    Top: boolean;
    Bottom: boolean;
    Left: boolean;
    Right: boolean;
};

/**
 * Operations to apply border
 * @param editor The editor instance
 * @param border The border to apply
 * @param operation The operation to apply
 */
export default function applyTableBorderFormat(
    editor: IStandaloneEditor,
    border: Border,
    operation: BorderOperations
) {
    editor.formatContentModel(
        model => {
            const [tableModel] = getFirstSelectedTable(model);

            if (tableModel) {
                const sel = getSelectedCells(tableModel);
                const perimeter: Perimeter = {
                    Top: false,
                    Bottom: false,
                    Left: false,
                    Right: false,
                };

                // Create border format with table format as backup
                let borderFormat = '';
                const format = tableModel.format;
                const { width, style, color } = border;
                const extractedBorder = extractBorderValues(format.borderTop);
                const borderColor = extractedBorder.color;
                const borderWidth = extractedBorder.width;
                const borderStyle = extractedBorder.style;

                if (width) {
                    borderFormat = parseValueWithUnit(width) + 'px';
                } else if (borderWidth) {
                    borderFormat = borderWidth;
                } else {
                    borderFormat = '1px';
                }

                if (style) {
                    borderFormat = `${borderFormat} ${style}`;
                } else if (borderStyle) {
                    borderFormat = `${borderFormat} ${borderStyle}`;
                } else {
                    borderFormat = `${borderFormat} solid`;
                }

                if (color) {
                    borderFormat = `${borderFormat} ${color}`;
                } else if (borderColor) {
                    borderFormat = `${borderFormat} ${borderColor}`;
                }

                if (sel) {
                    const operations: BorderOperations[] = [operation];
                    while (operations.length) {
                        switch (operations.pop()) {
                            case 'noBorders':
                                // Do All borders but with empty border format
                                borderFormat = '';
                                operations.push('allBorders');
                                break;
                            case 'allBorders':
                                const allBorders: BorderPositions[] = [
                                    'borderTop',
                                    'borderBottom',
                                    'borderInlineStart',
                                    'borderInlineEnd',
                                ];
                                for (
                                    let rowIndex = sel.firstRow;
                                    rowIndex <= sel.lastRow;
                                    rowIndex++
                                ) {
                                    for (
                                        let colIndex = sel.firstColumn;
                                        colIndex <= sel.lastColumn;
                                        colIndex++
                                    ) {
                                        const cell = tableModel.rows[rowIndex].cells[colIndex];
                                        // Format cells - All borders
                                        applyBorderFormat(cell, borderFormat, allBorders);
                                    }
                                }

                                // Format perimeter
                                perimeter.Top = true;
                                perimeter.Bottom = true;
                                perimeter.Left = true;
                                perimeter.Right = true;
                                break;
                            case 'leftBorders':
                                const leftBorder: BorderPositions[] = ['borderInlineStart'];
                                for (
                                    let rowIndex = sel.firstRow;
                                    rowIndex <= sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell = tableModel.rows[rowIndex].cells[sel.firstColumn];
                                    // Format cells - Left border
                                    applyBorderFormat(cell, borderFormat, leftBorder);
                                }

                                // Format perimeter
                                perimeter.Left = true;
                                break;
                            case 'rightBorders':
                                const rightBorder: BorderPositions[] = ['borderInlineEnd'];
                                for (
                                    let rowIndex = sel.firstRow;
                                    rowIndex <= sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell = tableModel.rows[rowIndex].cells[sel.lastColumn];
                                    // Format cells - Right border
                                    applyBorderFormat(cell, borderFormat, rightBorder);
                                }

                                // Format perimeter
                                perimeter.Right = true;
                                break;
                            case 'topBorders':
                                const topBorder: BorderPositions[] = ['borderTop'];
                                for (
                                    let colIndex = sel.firstColumn;
                                    colIndex <= sel.lastColumn;
                                    colIndex++
                                ) {
                                    const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                    // Format cells - Top border
                                    applyBorderFormat(cell, borderFormat, topBorder);
                                }

                                // Format perimeter
                                perimeter.Top = true;
                                break;
                            case 'bottomBorders':
                                const bottomBorder: BorderPositions[] = ['borderBottom'];
                                for (
                                    let colIndex = sel.firstColumn;
                                    colIndex <= sel.lastColumn;
                                    colIndex++
                                ) {
                                    const cell = tableModel.rows[sel.lastRow].cells[colIndex];
                                    // Format cells - Bottom border
                                    applyBorderFormat(cell, borderFormat, bottomBorder);
                                }

                                // Format perimeter
                                perimeter.Bottom = true;
                                break;
                            case 'insideBorders':
                                // Format cells - Inside borders
                                const singleCol = sel.lastColumn == sel.firstColumn;
                                const singleRow = sel.lastRow == sel.firstRow;
                                // Single cell selection
                                if (singleCol && singleRow) {
                                    break;
                                }
                                // Single column selection
                                if (singleCol) {
                                    applyBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[sel.firstColumn],
                                        borderFormat,
                                        ['borderBottom']
                                    );
                                    for (
                                        let rowIndex = sel.firstRow + 1;
                                        rowIndex <= sel.lastRow - 1;
                                        rowIndex++
                                    ) {
                                        const cell =
                                            tableModel.rows[rowIndex].cells[sel.firstColumn];
                                        applyBorderFormat(cell, borderFormat, [
                                            'borderTop',
                                            'borderBottom',
                                        ]);
                                    }
                                    applyBorderFormat(
                                        tableModel.rows[sel.lastRow].cells[sel.firstColumn],
                                        borderFormat,
                                        ['borderTop']
                                    );
                                    break;
                                }
                                // Single row selection
                                if (singleRow) {
                                    applyBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[sel.firstColumn],
                                        borderFormat,
                                        ['borderInlineEnd']
                                    );
                                    for (
                                        let colIndex = sel.firstColumn + 1;
                                        colIndex <= sel.lastColumn - 1;
                                        colIndex++
                                    ) {
                                        const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                        applyBorderFormat(cell, borderFormat, [
                                            'borderInlineStart',
                                            'borderInlineEnd',
                                        ]);
                                    }
                                    applyBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[sel.lastColumn],
                                        borderFormat,
                                        ['borderInlineStart']
                                    );
                                    break;
                                }

                                // For multiple rows and columns selections
                                // Top left cell
                                applyBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[sel.firstColumn],
                                    borderFormat,
                                    ['borderBottom', 'borderInlineEnd']
                                );
                                // Top right cell
                                applyBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[sel.lastColumn],
                                    borderFormat,
                                    ['borderBottom', 'borderInlineStart']
                                );
                                // Bottom left cell
                                applyBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[sel.firstColumn],
                                    borderFormat,
                                    ['borderTop', 'borderInlineEnd']
                                );
                                // Bottom right cell
                                applyBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[sel.lastColumn],
                                    borderFormat,
                                    ['borderTop', 'borderInlineStart']
                                );
                                // First row
                                for (
                                    let colIndex = sel.firstColumn + 1;
                                    colIndex < sel.lastColumn;
                                    colIndex++
                                ) {
                                    const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                    applyBorderFormat(cell, borderFormat, [
                                        'borderBottom',
                                        'borderInlineStart',
                                        'borderInlineEnd',
                                    ]);
                                }
                                // Last row
                                for (
                                    let colIndex = sel.firstColumn + 1;
                                    colIndex < sel.lastColumn;
                                    colIndex++
                                ) {
                                    const cell = tableModel.rows[sel.lastRow].cells[colIndex];
                                    applyBorderFormat(cell, borderFormat, [
                                        'borderTop',
                                        'borderInlineStart',
                                        'borderInlineEnd',
                                    ]);
                                }
                                // First column
                                for (
                                    let rowIndex = sel.firstRow + 1;
                                    rowIndex < sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell = tableModel.rows[rowIndex].cells[sel.firstColumn];
                                    applyBorderFormat(cell, borderFormat, [
                                        'borderTop',
                                        'borderBottom',
                                        'borderInlineEnd',
                                    ]);
                                }
                                // Last column
                                for (
                                    let rowIndex = sel.firstRow + 1;
                                    rowIndex < sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell = tableModel.rows[rowIndex].cells[sel.lastColumn];
                                    applyBorderFormat(cell, borderFormat, [
                                        'borderTop',
                                        'borderBottom',
                                        'borderInlineStart',
                                    ]);
                                }
                                // Inner cells
                                sel.firstColumn++;
                                sel.firstRow++;
                                sel.lastColumn--;
                                sel.lastRow--;
                                operations.push('allBorders');
                                break;
                            case 'outsideBorders':
                                // Format cells - Outside borders
                                operations.push('topBorders');
                                operations.push('bottomBorders');
                                operations.push('leftBorders');
                                operations.push('rightBorders');
                                break;
                            default:
                                break;
                        }
                    }

                    //Format perimeter if necessary or possible
                    modifyPerimeter(tableModel, sel, borderFormat, perimeter);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'tableBorder',
        }
    );
}

/**
 * @internal
 * Apply border format to a cell
 * @param cell The cell to apply border format
 * @param borderFormat The border format to apply
 * @param positions The positions to apply
 */
function applyBorderFormat(
    cell: ContentModelTableCell,
    borderFormat: string,
    positions: BorderPositions[]
) {
    positions.forEach(pos => {
        cell.format[pos] = borderFormat;
    });

    updateTableCellMetadata(cell, metadata => {
        metadata = metadata || {};
        metadata.borderOverride = true;
        return metadata;
    });

    // Cell was modified, so delete cached element
    delete cell.cachedElement;
}

/**
 * @internal
 * Modify the perimeter of the table selection
 * @param tableModel The table model
 * @param sel The table selection
 * @param borderFormat The border format to apply
 * If borderFormat is empty, the border will be removed
 * @param perimeter Where in the perimeter to apply
 */
function modifyPerimeter(
    tableModel: ContentModelTable,
    sel: TableSelectionCoordinates,
    borderFormat: string,
    perimeter: Perimeter
) {
    // Top of selection
    if (perimeter.Top && sel.firstRow - 1 >= 0) {
        for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
            const cell = tableModel.rows[sel.firstRow - 1].cells[colIndex];
            applyBorderFormat(cell, borderFormat, ['borderBottom']);
        }
    }
    // Bottom of selection
    if (perimeter.Bottom && sel.lastRow + 1 < tableModel.rows.length) {
        for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
            const cell = tableModel.rows[sel.lastRow + 1].cells[colIndex];
            applyBorderFormat(cell, borderFormat, ['borderTop']);
        }
    }
    // Left of selection
    if (perimeter.Left && sel.firstColumn - 1 >= 0) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            const cell = tableModel.rows[rowIndex].cells[sel.firstColumn - 1];
            applyBorderFormat(cell, borderFormat, ['borderInlineEnd']);
        }
    }
    // Right of selection
    if (perimeter.Right && sel.lastColumn + 1 < tableModel.rows[0].cells.length) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            const cell = tableModel.rows[rowIndex].cells[sel.lastColumn + 1];
            applyBorderFormat(cell, borderFormat, ['borderInlineStart']);
        }
    }
}
