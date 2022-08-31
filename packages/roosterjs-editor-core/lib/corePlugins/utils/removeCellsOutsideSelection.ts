import { isWholeTableSelected, VTable } from 'roosterjs-editor-dom';
import { VCell } from 'roosterjs-editor-types';

/**
 * @internal
 * Remove the cells outside of the selection.
 * @param vTable VTable to remove selection
 */
export const removeCellsOutsideSelection = (vTable: VTable) => {
    if (vTable.selection) {
        if (isWholeTableSelected(vTable, vTable.selection)) {
            return;
        }

        vTable.table.style.removeProperty('width');
        vTable.table.style.removeProperty('height');

        const { firstCell, lastCell } = vTable.selection;
        const resultCells: VCell[][] = [];

        const firstX = firstCell.x;
        const firstY = firstCell.y;
        const lastX = lastCell.x;
        const lastY = lastCell.y;

        if (vTable.cells) {
            vTable.cells.forEach((row, y) => {
                row = row.filter((_, x) => y >= firstY && y <= lastY && x >= firstX && x <= lastX);
                if (row.length > 0) {
                    resultCells.push(row);
                }
            });
            vTable.cells = resultCells;
        }
    }
};
