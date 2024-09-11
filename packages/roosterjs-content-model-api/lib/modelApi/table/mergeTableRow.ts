import { canMergeCells } from './canMergeCells';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    TableVerticalMergeOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableRow(
    table: ShallowMutableContentModelTable,
    operation: TableVerticalMergeOperation
) {
    const sel = getSelectedCells(table);
    const mergeAbove = operation == 'mergeAbove';

    if (sel) {
        const mergingRowIndex = mergeAbove ? sel.firstRow : sel.lastRow + 1;

        if (mergingRowIndex > 0 && mergingRowIndex < table.rows.length) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[mergingRowIndex].cells[colIndex];

                if (
                    cell &&
                    canMergeCells(
                        table.rows,
                        mergingRowIndex - 1,
                        colIndex,
                        mergingRowIndex,
                        colIndex
                    )
                ) {
                    mutateBlock(cell).spanAbove = true;

                    let newSelectedRow = mergingRowIndex;

                    while (table.rows[newSelectedRow]?.cells[colIndex]?.spanAbove) {
                        mutateBlock(table.rows[newSelectedRow].cells[colIndex]);
                        newSelectedRow--;
                    }

                    const newCell = table.rows[newSelectedRow]?.cells[colIndex];

                    if (newCell) {
                        mutateBlock(newCell).isSelected = true;
                    }
                }
            }
        }
    }
}
