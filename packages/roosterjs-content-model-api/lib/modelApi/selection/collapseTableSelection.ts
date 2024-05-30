import { addSegment, createSelectionMarker, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTableRow,
    TableSelectionCoordinates,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function collapseTableSelection(
    rows: ShallowMutableContentModelTableRow[],
    selection: TableSelectionCoordinates
) {
    const { firstColumn, firstRow } = selection;
    const cell = rows[firstRow]?.cells[firstColumn];
    if (cell) {
        addSegment(mutateBlock(cell), createSelectionMarker());
    }
}
