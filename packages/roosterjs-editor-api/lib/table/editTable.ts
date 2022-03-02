import { ChangeSource, IEditor, PositionType, TableOperation } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
export default function editTable(editor: IEditor, operation: TableOperation) {
    let td = editor.getElementAtCursor('TD,TH') as HTMLTableCellElement;
    if (td) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(td);
            vtable.edit(operation);
            vtable.writeBack();

            //Adding replaceNode to transform color when the theme is switched to dark.
            editor.replaceNode(vtable.table, vtable.table, true /**transformColorForDarkMode*/);
            editor.focus();
            let cellToSelect = calculateCellToSelect(operation, vtable.row, vtable.col);
            editor.select(
                vtable.getCell(cellToSelect.newRow, cellToSelect.newCol).td,
                PositionType.Begin
            );
        }, ChangeSource.Format);
    }
}

function calculateCellToSelect(operation: TableOperation, currentRow: number, currentCol: number) {
    let newRow = currentRow;
    let newCol = currentCol;
    switch (operation) {
        case TableOperation.InsertAbove:
            newCol = 0;
            break;
        case TableOperation.InsertBelow:
            newRow += 1;
            newCol = 0;
            break;
        case TableOperation.InsertLeft:
            newRow = 0;
            break;
        case TableOperation.InsertRight:
            newRow = 0;
            newCol += 1;
            break;
    }

    return {
        newRow,
        newCol,
    };
}
