import hasSelectionInBlock from '../selection/hasSelectionInBlock';
import type { ContentModelTable, TableSelectionCoordinates } from 'roosterjs-content-model-types';

/**
 * Clear selection of a table.
 * @param table The table model where the selection is to be cleared
 * @param sel The selection coordinates to be cleared
 */
export function clearSelectedCells(table: ContentModelTable, sel: TableSelectionCoordinates) {
    for (let i = sel.firstRow; i <= sel.lastRow; i++) {
        const row = table.rows[i];
        for (let j = sel.firstColumn; j <= sel.lastColumn; j++) {
            const cell = row.cells[j];
            delete cell.isSelected;
            if (cell.blocks.some(hasSelectionInBlock)) {
                cell.blocks.forEach(block => {
                    if (block.blockType == 'Paragraph') {
                        block.segments.forEach((segment, index) => {
                            if (segment.segmentType == 'SelectionMarker') {
                                block.segments.splice(index, 1);
                            }
                        });
                    }
                });
            }
        }
    }
}
