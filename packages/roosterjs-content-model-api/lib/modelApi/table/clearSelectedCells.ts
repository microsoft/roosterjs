import { setSelection } from 'roosterjs-content-model-dom';
import type { ContentModelTable, TableSelectionCoordinates } from 'roosterjs-content-model-types';

/**
 * Clear selection of a table.
 * @param table The table model where the selection is to be cleared
 * @param sel The selection coordinates to be cleared
 */
export function clearSelectedCells(table: ContentModelTable, sel: TableSelectionCoordinates) {
    if (
        sel.firstColumn >= 0 &&
        sel.firstRow >= 0 &&
        sel.lastColumn < table.widths.length &&
        sel.lastRow < table.rows.length
    ) {
        for (let i = sel.firstRow; i <= sel.lastRow; i++) {
            const row = table.rows[i];
            for (let j = sel.firstColumn; j <= sel.lastColumn; j++) {
                const cell = row.cells[j];
                cell.isSelected = false;
                setSelection(cell);
            }
        }
    }
}
