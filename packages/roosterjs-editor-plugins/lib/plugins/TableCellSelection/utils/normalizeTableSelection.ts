import { TableSelection } from 'roosterjs-editor-types';
/**
 * @internal
 * Make the first Cell of a table selection always be on top of the last cell.
 * @param input Table selection
 * @returns Table Selection where the first cell is always going to be first selected in the table
 * and the last cell always going to be last selected in the table.
 */
export function normalizeTableSelection(input: TableSelection): TableSelection {
    const { firstCell, lastCell } = input;
    let firstEl =
        firstCell.y < lastCell.y
            ? firstCell
            : firstCell.y == lastCell.y
            ? firstCell.x < lastCell.x
                ? firstCell
                : lastCell
            : lastCell;

    let lastEl = firstEl == firstCell ? lastCell : firstCell;

    return { firstCell: firstEl, lastCell: lastEl };
}
