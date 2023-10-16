import { canMergeCells } from './canMergeCells';
import { getSelectedCells } from './getSelectedCells';
import { TableHorizontalMergeOperation } from '../../publicTypes/parameter/TableOperation';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableColumn(
    table: ContentModelTable,
    operation: TableHorizontalMergeOperation
) {
    const sel = getSelectedCells(table);
    const mergeLeft = operation == 'mergeLeft';

    if (sel) {
        const mergingColIndex = mergeLeft ? sel.firstCol : sel.lastCol + 1;

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
                    cell.spanLeft = true;

                    let newSelectedCol = mergingColIndex;

                    while (table.rows[rowIndex]?.cells[newSelectedCol]?.spanLeft) {
                        delete table.rows[rowIndex].cells[newSelectedCol].cachedElement;
                        newSelectedCol--;
                    }

                    if (table.rows[rowIndex]?.cells[newSelectedCol]) {
                        table.rows[rowIndex].cells[newSelectedCol].isSelected = true;

                        delete table.rows[rowIndex].cells[newSelectedCol].cachedElement;
                    }

                    delete cell.cachedElement;
                }

                delete table.rows[rowIndex].cachedElement;
            }
        }
    }
}
