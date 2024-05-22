import {
    extractBorderValues,
    getFirstSelectedTable,
    getSelectedCells,
    hasMetadata,
    parseValueWithUnit,
    setFirstColumnFormatBorders,
    updateTableCellMetadata,
    updateTableMetadata,
} from 'roosterjs-content-model-dom';
import type {
    IEditor,
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
type BorderPositions = 'borderTop' | 'borderBottom' | 'borderLeft' | 'borderRight';

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
export function applyTableBorderFormat(
    editor: IEditor,
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

                // undefined is treated as Left to Right
                const isRtl = tableModel.format.direction == 'rtl';

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
                                    'borderLeft',
                                    'borderRight',
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
                                const leftBorder: BorderPositions[] = ['borderLeft'];
                                for (
                                    let rowIndex = sel.firstRow;
                                    rowIndex <= sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell =
                                        tableModel.rows[rowIndex].cells[
                                            isRtl ? sel.lastColumn : sel.firstColumn
                                        ];
                                    // Format cells - Left border
                                    applyBorderFormat(cell, borderFormat, leftBorder);
                                }

                                // Format perimeter
                                isRtl ? (perimeter.Right = true) : (perimeter.Left = true);
                                break;
                            case 'rightBorders':
                                const rightBorder: BorderPositions[] = ['borderRight'];
                                for (
                                    let rowIndex = sel.firstRow;
                                    rowIndex <= sel.lastRow;
                                    rowIndex++
                                ) {
                                    const cell =
                                        tableModel.rows[rowIndex].cells[
                                            isRtl ? sel.firstColumn : sel.lastColumn
                                        ];
                                    // Format cells - Right border
                                    applyBorderFormat(cell, borderFormat, rightBorder);
                                }

                                // Format perimeter
                                isRtl ? (perimeter.Left = true) : (perimeter.Right = true);
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
                                        tableModel.rows[sel.firstRow].cells[
                                            isRtl ? sel.lastColumn : sel.firstColumn
                                        ],
                                        borderFormat,
                                        ['borderRight']
                                    );
                                    for (
                                        let colIndex = sel.firstColumn + 1;
                                        colIndex <= sel.lastColumn - 1;
                                        colIndex++
                                    ) {
                                        const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                        applyBorderFormat(cell, borderFormat, [
                                            'borderLeft',
                                            'borderRight',
                                        ]);
                                    }
                                    applyBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[
                                            isRtl ? sel.firstColumn : sel.lastColumn
                                        ],
                                        borderFormat,
                                        ['borderLeft']
                                    );
                                    break;
                                }

                                // For multiple rows and columns selections
                                // Top left cell
                                applyBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[
                                        isRtl ? sel.lastColumn : sel.firstColumn
                                    ],
                                    borderFormat,
                                    ['borderBottom', 'borderRight']
                                );
                                // Top right cell
                                applyBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[
                                        isRtl ? sel.firstColumn : sel.lastColumn
                                    ],
                                    borderFormat,
                                    ['borderBottom', 'borderLeft']
                                );
                                // Bottom left cell
                                applyBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[
                                        isRtl ? sel.lastColumn : sel.firstColumn
                                    ],
                                    borderFormat,
                                    ['borderTop', 'borderRight']
                                );
                                // Bottom right cell
                                applyBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[
                                        isRtl ? sel.firstColumn : sel.lastColumn
                                    ],
                                    borderFormat,
                                    ['borderTop', 'borderLeft']
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
                                        'borderLeft',
                                        'borderRight',
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
                                        'borderLeft',
                                        'borderRight',
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
                                        isRtl ? 'borderLeft' : 'borderRight',
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
                                        isRtl ? 'borderRight' : 'borderLeft',
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
                    modifyPerimeter(tableModel, sel, borderFormat, perimeter, isRtl);
                }

                const tableMeta = hasMetadata(tableModel) ? updateTableMetadata(tableModel) : {};
                if (tableMeta) {
                    // Enforce first column format if necessary
                    setFirstColumnFormatBorders(tableModel.rows, tableMeta);
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
    perimeter: Perimeter,
    isRtl: boolean
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
            applyBorderFormat(cell, borderFormat, [isRtl ? 'borderLeft' : 'borderRight']);
        }
    }
    // Right of selection
    if (perimeter.Right && sel.lastColumn + 1 < tableModel.rows[0].cells.length) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            const cell = tableModel.rows[rowIndex].cells[sel.lastColumn + 1];
            applyBorderFormat(cell, borderFormat, [isRtl ? 'borderRight' : 'borderLeft']);
        }
    }
}
