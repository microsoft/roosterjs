import { canMergeCells } from './canMergeCells';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function mergeTableColumn(
    table: ContentModelTable,
    operation:
        | TableOperation.MergeLeft
        | TableOperation.MergeRight
        | CompatibleTableOperation.MergeLeft
        | CompatibleTableOperation.MergeRight
) {
    const sel = getSelectedCells(table);
    const mergeLeft = operation == TableOperation.MergeLeft;

    if (sel) {
        const mergingColIndex = mergeLeft ? sel.firstCol : sel.lastCol + 1;

        if (mergingColIndex > 0 && mergingColIndex < table.cells[0].length) {
            for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                const cell = table.cells[rowIndex]?.[mergingColIndex];

                if (
                    cell &&
                    canMergeCells(
                        table.cells,
                        rowIndex,
                        mergingColIndex - 1,
                        rowIndex,
                        mergingColIndex
                    )
                ) {
                    cell.spanLeft = true;

                    let newSelectedCol = mergingColIndex;

                    while (table.cells[rowIndex]?.[newSelectedCol]?.spanLeft) {
                        delete table.cells[rowIndex][newSelectedCol].cachedElement;
                        newSelectedCol--;
                    }

                    if (table.cells[rowIndex]?.[newSelectedCol]) {
                        table.cells[rowIndex][newSelectedCol].isSelected = true;

                        delete table.cells[rowIndex][newSelectedCol].cachedElement;
                    }

                    delete cell.cachedElement;
                }
            }
        }
    }
}
