import { addSegment, createSelectionMarker } from 'roosterjs-content-model';
import { ContentModelTableRow } from 'roosterjs-content-model-types';
import { TableSelectionCoordinates } from '../table/getSelectedCells';

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
