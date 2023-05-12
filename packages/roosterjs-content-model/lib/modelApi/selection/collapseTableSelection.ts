import { addSegment } from '../common/addSegment';
import { ContentModelTableRow } from '../../publicTypes/block/ContentModelTableRow';
import { createSelectionMarker } from '../creators/createSelectionMarker';
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
