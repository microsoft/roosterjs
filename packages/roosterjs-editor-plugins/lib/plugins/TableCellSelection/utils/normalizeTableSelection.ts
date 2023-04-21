import { Coordinates, TableSelection } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Make the first Cell of a table selection always be on top of the last cell.
 * @param input Table selection
 * @returns Table Selection where the first cell is always going to be first selected in the table
 * and the last cell always going to be last selected in the table.
 */
export default function normalizeTableSelection(vTable: VTable): TableSelection | null {
    const { firstCell, lastCell } = vTable?.selection || {};
    if (!vTable?.cells || !vTable.selection || !firstCell || !lastCell) {
        return null;
    }

    const cells = vTable.cells;

    let newFirst = {
        x: Math.min(firstCell.x, lastCell.x),
        y: Math.min(firstCell.y, lastCell.y),
    };
    let newLast = {
        x: Math.max(firstCell.x, lastCell.x),
        y: Math.max(firstCell.y, lastCell.y),
    };

    const fixCoordinates = (coord: Coordinates) => {
        if (coord.x < 0) {
            coord.x = 0;
        }
        if (coord.y < 0) {
            coord.y = 0;
        }

        if (coord.y >= cells.length) {
            coord.y = cells.length - 1;
        }

        const rowsCells = cells[coord.y].length;
        if (coord.x >= rowsCells) {
            coord.x = rowsCells - 1;
        }
    };

    fixCoordinates(newFirst);
    fixCoordinates(newLast);

    return { firstCell: newFirst, lastCell: newLast };
}
