import { addSegment } from '../common/addSegment';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { TableSelectionCoordinates } from './setSelectionToTable';

/**
 * @internal
 */
export function collapseTableSelection(
    cells: ContentModelTableCell[][],
    selection: TableSelectionCoordinates
) {
    const { firstCol, firstRow, lastCol, lastRow } = selection;

    for (let row = 0; row < cells.length; row++) {
        for (let col = 0; col < cells[row].length; col++) {
            if (row >= firstRow && row <= lastRow && col >= firstCol && col <= lastCol) {
                addSegment(cells[row][col], createSelectionMarker());
                return;
            }
        }
    }
}
