import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    TableCellShiftOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function shiftCells(table: ShallowMutableContentModelTable, value: TableCellShiftOperation) {
    const sel = getSelectedCells(table);
    const rows = table.rows;
    if (sel) {
        const { lastColumn, lastRow, firstColumn, firstRow } = sel;
        if (value == 'shiftCellsLeft') {
            const selectionLength = lastColumn - firstColumn + 1;
            for (let i = firstRow; i <= lastRow; i++) {
                const cellsNumber = rows[i].cells.length;
                for (let j = firstColumn; j < cellsNumber; j++) {
                    const nextCellIndex = j + selectionLength;
                    if (rows[i].cells[nextCellIndex]) {
                        mutateBlock(rows[i].cells[j]).blocks = [
                            ...rows[i].cells[nextCellIndex].blocks,
                        ];
                        mutateBlock(rows[i].cells[nextCellIndex]).blocks = [];
                    } else {
                        mutateBlock(rows[i].cells[j]).blocks = [];
                    }
                }
            }
        } else {
            const selectionLength = lastRow - firstRow + 1;
            for (let j = firstColumn; j <= lastColumn; j++) {
                const cellsNumber = rows.length;
                for (let i = firstRow; i < cellsNumber; i++) {
                    const nextCellIndex = i + selectionLength;
                    if (rows[nextCellIndex]?.cells[j]) {
                        mutateBlock(rows[i].cells[j]).blocks = [
                            ...rows[nextCellIndex].cells[j].blocks,
                        ];
                        mutateBlock(rows[nextCellIndex].cells[j]).blocks = [];
                    } else {
                        mutateBlock(rows[i].cells[j]).blocks = [];
                    }
                }
            }
        }
    }
}
