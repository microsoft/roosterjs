import {
    getFirstSelectedTable,
    hasSelectionInBlockGroup,
    MIN_ALLOWED_TABLE_CELL_HEIGHT,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set the row height and column width of selected table cells in pixels.
 * Other cells in the same rows and columns are resized too, and the table can grow or shrink.
 * Merged cells use the sum of their underlying row heights and column widths.
 * @param editor The editor instance
 * @param height The row height in pixels, clamped to the table resizer minimum of 22.
 * Omit to keep existing heights.
 * @param width The column width in pixels, clamped to the table resizer minimum of 30.
 * Omit to keep existing widths.
 * @throws RangeError If a supplied dimension is not a finite positive number
 */
export function setTableCellSize(editor: IEditor, height?: number, width?: number) {
    if (
        (height !== undefined && (!Number.isFinite(height) || height <= 0)) ||
        (width !== undefined && (!Number.isFinite(width) || width <= 0))
    ) {
        throw new RangeError('Table cell dimensions must be finite positive numbers.');
    }

    editor.focus();
    editor.formatContentModel(
        model => {
            const [table] = getFirstSelectedTable(model);

            if (!table || (height === undefined && width === undefined)) {
                return false;
            }

            const selectedRows = new Set<number>();
            const selectedColumns = new Set<number>();

            for (const [rowIndex, row] of table.rows.entries()) {
                for (const [columnIndex, cell] of row.cells.entries()) {
                    if (hasSelectionInBlockGroup(cell)) {
                        let firstRow = rowIndex;
                        let firstColumn = columnIndex;

                        while (firstRow > 0 && table.rows[firstRow].cells[firstColumn].spanAbove) {
                            firstRow--;
                        }
                        while (
                            firstColumn > 0 &&
                            table.rows[firstRow].cells[firstColumn].spanLeft
                        ) {
                            firstColumn--;
                        }

                        selectedRows.add(firstRow);
                        selectedColumns.add(firstColumn);

                        for (
                            let row = firstRow + 1;
                            table.rows[row]?.cells[firstColumn]?.spanAbove;
                            row++
                        ) {
                            selectedRows.add(row);
                        }
                        for (
                            let column = firstColumn + 1;
                            table.rows[firstRow].cells[column]?.spanLeft;
                            column++
                        ) {
                            selectedColumns.add(column);
                        }
                    }
                }
            }

            if (selectedRows.size == 0) {
                return false;
            }

            const mutableTable = mutateBlock(table);

            if (height !== undefined) {
                for (const row of selectedRows) {
                    mutableTable.rows[row].height = Math.max(height, MIN_ALLOWED_TABLE_CELL_HEIGHT);
                }
                delete mutableTable.format.height;
            }

            if (width !== undefined) {
                for (const column of selectedColumns) {
                    mutableTable.widths[column] = Math.max(width, MIN_ALLOWED_TABLE_CELL_WIDTH);
                }
                delete mutableTable.format.width;
            }

            // Cell DOM caches include sizes, including sizes shared with unselected and merged cells.
            for (const row of mutableTable.rows) {
                for (const cell of row.cells) {
                    const format = mutateBlock(cell).format;
                    format.useBorderBox = true;

                    if (height !== undefined) {
                        delete format.height;
                    }
                    if (width !== undefined) {
                        delete format.width;
                    }
                }
            }

            return true;
        },
        { apiName: 'setTableCellSize' },
        { recalculateTableSize: 'selected' }
    );
}
