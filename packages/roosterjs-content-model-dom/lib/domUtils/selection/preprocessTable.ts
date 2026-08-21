import { getSelectedCells } from '../../modelApi/selection/getSelectedCells';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function preprocessTable(table: ContentModelTable) {
    const sel = getSelectedCells(table);
    table.rows = table.rows
        .map(row => {
            return {
                ...row,
                cells: row.cells.filter(cell => cell.isSelected),
            };
        })
        .filter(row => row.cells.length > 0);

    delete table.format.width;

    table.widths = sel
        ? table.widths.filter((_, index) => index >= sel?.firstColumn && index <= sel?.lastColumn)
        : [];
}
