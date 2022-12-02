import cloneCellStyles from './cloneCellStyles';
import moveChildNodes from '../utils/moveChildNodes';
import VTable from './VTable';
import { NodePosition, TableOperation } from 'roosterjs-editor-types';

/**
 *
 * Pastes a table inside another, modifying the original to create a merged one
 * @param currentTd The cell where the cursor is in the table to paste into
 * @param rootNodeToInsert A Node containing the table to be inserted
 * @param position The position to paste the table
 * @param range The selected range of the table
 *
 * Position and range are here for when table selection allows to move pivot point
 */
export default function pasteTable(
    currentTd: HTMLTableCellElement,
    rootNodeToInsert: HTMLTableElement,
    position?: NodePosition,
    range?: Range
) {
    // This is the table on the clipboard
    let newTable = new VTable(rootNodeToInsert);
    // This table is already on the editor
    let currentTable = new VTable(currentTd);

    // Which cell in the currentTable is the cursor placed
    let cursorRow = currentTable.row!;
    let cursorCol = currentTable.col!;

    // Total rows and columns of the final table
    let rows = cursorRow + newTable.cells?.length! ?? 0;
    let columns = cursorCol + newTable.cells?.[0].length! ?? 0;

    // Add new rows
    currentTable.row = currentTable.cells!.length! - 1;
    while (currentTable.cells!.length! < rows) {
        currentTable.edit(TableOperation.InsertBelow);
    }

    // Add new columns
    currentTable.col = currentTable.cells![0].length! - 1;
    while (currentTable.cells![0].length! < columns) {
        currentTable.edit(TableOperation.InsertRight);
    }

    // Create final table
    for (let i = cursorRow; i < rows; i++) {
        for (let j = cursorCol; j < columns; j++) {
            let cell = currentTable.getCell(i, j);
            let newCell = newTable.getTd(i - cursorRow, j - cursorCol);
            if (cell.td && newCell) {
                moveChildNodes(cell.td, newCell);
                cloneCellStyles(cell.td, newCell);
            } else {
                cell.td = document.createElement('td');
            }
        }
    }

    currentTable.writeBack();
}
