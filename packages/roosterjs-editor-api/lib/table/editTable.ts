import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor, PositionType, SelectionRangeTypes, TableOperation } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
export default function editTable(
    editor: IEditor,
    operation: TableOperation | CompatibleTableOperation
) {
    let td = editor.getElementAtCursor('TD,TH') as HTMLTableCellElement;
    if (td) {
        formatUndoSnapshot(
            editor,
            () => {
                let vtable = new VTable(td);

                saveTableSelection(editor, vtable);
                vtable.edit(operation);
                vtable.writeBack();
                editor.transformToDarkColor(vtable.table);

                editor.focus();
                let cellToSelect = calculateCellToSelect(operation, vtable.row, vtable.col);
                editor.select(
                    vtable.getCell(cellToSelect.newRow, cellToSelect.newCol).td,
                    PositionType.Begin
                );

                return operation;
            },
            'editTable'
        );
    }
}

function calculateCellToSelect(
    operation: TableOperation | CompatibleTableOperation,
    currentRow: number,
    currentCol: number
) {
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

function saveTableSelection(editor: IEditor, vtable: VTable) {
    const selection = editor.getSelectionRangeEx();
    if (selection && selection.type === SelectionRangeTypes.TableSelection) {
        vtable.selection = selection.coordinates;
    }
}
