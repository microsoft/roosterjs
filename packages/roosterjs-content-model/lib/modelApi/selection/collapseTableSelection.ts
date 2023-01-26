import { addSegment } from '../common/addSegment';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { TableSelectionCoordinates } from '../table/getSelectedCells';

/**
 * @internal
 */
export function collapseTableSelection(
    cells: ContentModelTableCell[][],
    selection: TableSelectionCoordinates
) {
    const { firstCol, firstRow } = selection;
    const cell = cells[firstRow]?.[firstCol];
    if (cell) {
        addSegment(cell, createSelectionMarker());
    }
}
