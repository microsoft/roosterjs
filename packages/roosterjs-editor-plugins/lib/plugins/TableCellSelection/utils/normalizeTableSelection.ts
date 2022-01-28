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

    let newFirst = {
        x: min(firstCell.x, lastCell.x),
        y: min(firstCell.y, lastCell.y),
    };
    let newLast = {
        x: max(firstCell.x, lastCell.x),
        y: max(firstCell.y, lastCell.y),
    };

    return { firstCell: newFirst, lastCell: newLast };
}

function min(input1: number, input2: number) {
    return input1 > input2 ? input2 : input1;
}

function max(input1: number, input2: number) {
    return input1 < input2 ? input2 : input1;
}
