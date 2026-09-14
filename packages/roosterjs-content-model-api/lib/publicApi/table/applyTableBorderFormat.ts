import {
    extractBorderValues,
    getFirstSelectedTable,
    getSelectedCells,
    mutateBlock,
    getTableMetadata,
    parseValueWithUnit,
    parseColor,
    setFirstColumnFormatBorders,
    updateTableCellMetadata,
} from 'roosterjs-content-model-dom';
import type {
    IEditor,
    Border,
    BorderOperations,
    TableSelectionCoordinates,
    ReadonlyContentModelTableCell,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Border positions
 */
type BorderPositions = 'borderTop' | 'borderBottom' | 'borderLeft' | 'borderRight';

/**
 * @internal
 * Border positions to update on a cell
 */
type BorderUpdate = {
    cell: ReadonlyContentModelTableCell;
    positions: BorderPositions[];
};

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
 * Remove the targeted borders instead if they all already match the requested format.
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
                    const borderUpdates: BorderUpdate[] = [];
                    const collectBorderFormat = (
                        cell: ReadonlyContentModelTableCell,
                        positions: BorderPositions[]
                    ) => {
                        borderUpdates.push({ cell, positions });
                    };
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
                                        collectBorderFormat(cell, allBorders);
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
                                    collectBorderFormat(cell, leftBorder);
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
                                    collectBorderFormat(cell, rightBorder);
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
                                    collectBorderFormat(cell, topBorder);
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
                                    collectBorderFormat(cell, bottomBorder);
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
                                    collectBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[sel.firstColumn],
                                        ['borderBottom']
                                    );
                                    for (
                                        let rowIndex = sel.firstRow + 1;
                                        rowIndex <= sel.lastRow - 1;
                                        rowIndex++
                                    ) {
                                        const cell =
                                            tableModel.rows[rowIndex].cells[sel.firstColumn];
                                        collectBorderFormat(cell, ['borderTop', 'borderBottom']);
                                    }
                                    collectBorderFormat(
                                        tableModel.rows[sel.lastRow].cells[sel.firstColumn],
                                        ['borderTop']
                                    );
                                    break;
                                }
                                // Single row selection
                                if (singleRow) {
                                    collectBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[
                                            isRtl ? sel.lastColumn : sel.firstColumn
                                        ],
                                        ['borderRight']
                                    );
                                    for (
                                        let colIndex = sel.firstColumn + 1;
                                        colIndex <= sel.lastColumn - 1;
                                        colIndex++
                                    ) {
                                        const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                        collectBorderFormat(cell, ['borderLeft', 'borderRight']);
                                    }
                                    collectBorderFormat(
                                        tableModel.rows[sel.firstRow].cells[
                                            isRtl ? sel.firstColumn : sel.lastColumn
                                        ],
                                        ['borderLeft']
                                    );
                                    break;
                                }

                                // For multiple rows and columns selections
                                // Top left cell
                                collectBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[
                                        isRtl ? sel.lastColumn : sel.firstColumn
                                    ],
                                    ['borderBottom', 'borderRight']
                                );
                                // Top right cell
                                collectBorderFormat(
                                    tableModel.rows[sel.firstRow].cells[
                                        isRtl ? sel.firstColumn : sel.lastColumn
                                    ],
                                    ['borderBottom', 'borderLeft']
                                );
                                // Bottom left cell
                                collectBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[
                                        isRtl ? sel.lastColumn : sel.firstColumn
                                    ],
                                    ['borderTop', 'borderRight']
                                );
                                // Bottom right cell
                                collectBorderFormat(
                                    tableModel.rows[sel.lastRow].cells[
                                        isRtl ? sel.firstColumn : sel.lastColumn
                                    ],
                                    ['borderTop', 'borderLeft']
                                );
                                // First row
                                for (
                                    let colIndex = sel.firstColumn + 1;
                                    colIndex < sel.lastColumn;
                                    colIndex++
                                ) {
                                    const cell = tableModel.rows[sel.firstRow].cells[colIndex];
                                    collectBorderFormat(cell, [
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
                                    collectBorderFormat(cell, [
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
                                    collectBorderFormat(cell, [
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
                                    collectBorderFormat(cell, [
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

                    // Compare before changing any cells, and only consider borders targeted by
                    // this operation. Normalize CSS so DOM colors (rgb) also match hex input.
                    if (
                        operation != 'noBorders' &&
                        borderUpdates.length > 0 &&
                        hasMatchingBorders(borderUpdates, borderFormat)
                    ) {
                        borderFormat = '';
                    }

                    for (const { cell, positions } of borderUpdates) {
                        applyBorderFormat(cell, borderFormat, positions);
                    }

                    //Format perimeter if necessary or possible
                    modifyPerimeter(tableModel, sel, borderFormat, perimeter, isRtl);
                }

                const tableMeta = getTableMetadata(tableModel);
                if (tableMeta) {
                    // Enforce first column format if necessary
                    setFirstColumnFormatBorders(mutateBlock(tableModel).rows, tableMeta);
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
 * Check targeted borders without repeatedly parsing identical CSS values.
 * @param borderUpdates The borders to compare
 * @param borderFormat The requested border format
 */
function hasMatchingBorders(borderUpdates: BorderUpdate[], borderFormat: string): boolean {
    const matchingBorders = new Set<string>();

    for (const { cell, positions } of borderUpdates) {
        for (const pos of positions) {
            const value = cell.format[pos] || '';

            // Exact matches need no CSS parsing. Equivalent values are parsed only once.
            if (value == borderFormat || matchingBorders.has(value)) {
                continue;
            }

            if (!areSameBorders(value, borderFormat)) {
                return false;
            }

            matchingBorders.add(value);
        }
    }

    return true;
}

/**
 * Compare border components, parsing colors to account for equivalent hex and RGB values.
 */
function areSameBorders(border1: string, border2: string): boolean {
    const values1 = extractBorderValues(border1);
    const values2 = extractBorderValues(border2);
    const color1 = values1.color || '';
    const color2 = values2.color || '';
    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);

    return (
        values1.width == values2.width &&
        values1.style == values2.style &&
        (color1 == color2 ||
            (!!rgb1 && !!rgb2 && rgb1[0] == rgb2[0] && rgb1[1] == rgb2[1] && rgb1[2] == rgb2[2]))
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
    cell: ReadonlyContentModelTableCell,
    borderFormat: string,
    positions: BorderPositions[]
) {
    const mutableCell = mutateBlock(cell);

    positions.forEach(pos => {
        mutableCell.format[pos] = borderFormat;
    });

    updateTableCellMetadata(mutableCell, metadata => {
        metadata = metadata || {};
        metadata.borderOverride = true;
        return metadata;
    });
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
    tableModel: ReadonlyContentModelTable,
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
