import { addSegment, createSelectionMarker } from 'roosterjs-content-model-dom';
import type {
    ContentModelTableRow,
    TableSelectionCoordinates,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function collapseTableSelection(
    rows: ContentModelTableRow[],
    selection: TableSelectionCoordinates
) {
    const { firstColumn, firstRow } = selection;
    const cell = rows[firstRow]?.cells[firstColumn];
    if (cell) {
        addSegment(cell, createSelectionMarker());
    }
}
