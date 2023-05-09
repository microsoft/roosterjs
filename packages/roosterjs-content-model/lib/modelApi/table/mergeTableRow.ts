import { canMergeCells } from './canMergeCells';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function mergeTableRow(
    table: ContentModelTable,
    operation:
        | TableOperation.MergeAbove
        | TableOperation.MergeBelow
        | CompatibleTableOperation.MergeAbove
        | CompatibleTableOperation.MergeBelow
) {
    const sel = getSelectedCells(table);
    const mergeAbove = operation == TableOperation.MergeAbove;

    if (sel) {
        const mergingRowIndex = mergeAbove ? sel.firstRow : sel.lastRow + 1;

        if (mergingRowIndex > 0 && mergingRowIndex < table.rows.length) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
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
                    cell.spanAbove = true;

                    let newSelectedRow = mergingRowIndex;

                    while (table.rows[newSelectedRow]?.cells[colIndex]?.spanAbove) {
                        delete table.rows[newSelectedRow].cells[colIndex].cachedElement;
                        delete table.rows[newSelectedRow].cachedElement;
                        newSelectedRow--;
                    }

                    if (table.rows[newSelectedRow]?.cells[colIndex]) {
                        table.rows[newSelectedRow].cells[colIndex].isSelected = true;

                        delete table.rows[newSelectedRow].cells[colIndex].cachedElement;
                        delete table.rows[newSelectedRow].cachedElement;
                    }

                    delete cell.cachedElement;
                }
            }
        }
    }
}
