import { Coordinates, TableSelection } from 'roosterjs-editor-types';

/**
 * Make the first Cell of a table selection always be on top of the last cell.
 * @param input Table selection
 * @returns Table Selection where the first cell is always going to be first selected in the table
 * and the last cell always going to be last selected in the table.
 */
export default function normalizeTableSelection(
    input: TableSelection,
    table: HTMLTableElement
): TableSelection {
    const { firstCell, lastCell } = input;

    let newFirst = {
        x: Math.min(firstCell.x, lastCell.x),
        y: Math.min(firstCell.y, lastCell.y),
    };
    let newLast = {
        x: Math.max(firstCell.x, lastCell.x),
        y: Math.max(firstCell.y, lastCell.y),
    };

    const checkIfExists = (coord: Coordinates) => table?.rows?.item(coord.y)?.cells.item(coord.x);

    if (!checkIfExists(newFirst) || !checkIfExists(newLast)) {
        throw new Error('Table selection provided is not valid');
    }

    return { firstCell: newFirst, lastCell: newLast };
}
