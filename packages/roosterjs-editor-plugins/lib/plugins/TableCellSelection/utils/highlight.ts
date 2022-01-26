import { deselectCellHandler } from './deselectCellHandler';
import { highlightCellHandler } from './highlightCellHandler';
import { normalizeTableSelection } from './normalizeTableSelection';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Highlights a range of cells, used in the TableSelection Plugin
 */
export function highlight(vTable: VTable): void {
    if (vTable.selection && vTable.cells && vTable) {
        if (!vTable.table.classList.contains(tableCellSelectionCommon.TABLE_SELECTED)) {
            vTable.table.classList.add(tableCellSelectionCommon.TABLE_SELECTED);
        }
        const { firstCell, lastCell } = normalizeTableSelection(vTable.selection);

        let colIndex = vTable.cells[vTable.cells.length - 1].length - 1;
        const selectedAllTable =
            firstCell.x == 0 &&
            firstCell.y == 0 &&
            lastCell.x == colIndex &&
            lastCell.y == vTable.cells.length - 1;

        for (let indexY = 0; indexY < vTable.cells.length; indexY++) {
            for (let indexX = 0; indexX < vTable.cells[indexY].length; indexX++) {
                let element = getMergedCell(vTable, indexX, indexY);
                if (element) {
                    if (
                        selectedAllTable ||
                        (((indexY >= firstCell.y && indexY <= lastCell.y) ||
                            (indexY <= firstCell.y && indexY >= lastCell.y)) &&
                            ((indexX >= firstCell.x && indexX <= lastCell.x) ||
                                (indexX <= firstCell.x && indexX >= lastCell.x)))
                    ) {
                        highlightCellHandler(element);
                    } else {
                        deselectCellHandler(element);
                    }
                }
            }
        }
    }
}

function getMergedCell(vTable: VTable, x: number, y: number) {
    let element = vTable.cells[y][x].td as HTMLElement;
    if (vTable.cells[y][x].spanLeft) {
        for (let cellX = x; cellX > 0; cellX--) {
            const cell = vTable.cells[y][cellX];
            if (cell.spanAbove) {
                element = null;
                break;
            }
            if (cell.td) {
                element = cell.td;
                x = cellX;
                break;
            }
        }
    }

    return element;
}
