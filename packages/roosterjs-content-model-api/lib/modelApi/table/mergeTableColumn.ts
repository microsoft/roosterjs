import { canMergeCells } from './canMergeCells';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    TableHorizontalMergeOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableColumn(
    table: ShallowMutableContentModelTable,
    operation: TableHorizontalMergeOperation
) {
    const sel = getSelectedCells(table);
    const mergeLeft = operation == 'mergeLeft';

    if (sel) {
        const mergingColIndex = mergeLeft ? sel.firstColumn : sel.lastColumn + 1;

        if (mergingColIndex > 0 && mergingColIndex < table.rows[0].cells.length) {
            for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                const cell = table.rows[rowIndex]?.cells[mergingColIndex];

                if (
                    cell &&
                    canMergeCells(
                        table.rows,
                        rowIndex,
                        mergingColIndex - 1,
                        rowIndex,
                        mergingColIndex
                    )
                ) {
                    mutateBlock(cell).spanLeft = true;

                    let newSelectedCol = mergingColIndex;

                    while (table.rows[rowIndex]?.cells[newSelectedCol]?.spanLeft) {
                        mutateBlock(table.rows[rowIndex].cells[newSelectedCol]);
                        newSelectedCol--;
                    }

                    const newCell = table.rows[rowIndex]?.cells[newSelectedCol];
                    if (newCell) {
                        mutateBlock(newCell).isSelected = true;
                    }
                }
            }
        }
    }
}
