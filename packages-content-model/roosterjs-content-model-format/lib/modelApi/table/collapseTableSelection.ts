import { addSegment, createSelectionMarker } from 'roosterjs-content-model-dom';
import type { ContentModelTableRow } from 'roosterjs-content-model-types';
import type { TableSelectionCoordinates } from '../table/getSelectedCells';

/**
 * @internal
 */
export function collapseTableSelection(
    rows: ContentModelTableRow[],
    selection: TableSelectionCoordinates
) {
    const { firstCol, firstRow } = selection;
    const cell = rows[firstRow]?.cells[firstCol];
    if (cell) {
        addSegment(cell, createSelectionMarker());
    }
}
