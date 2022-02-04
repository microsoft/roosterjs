import { ChangeSource, IEditor, TableFormat } from 'roosterjs-editor-types';
import { saveTableInfo } from 'roosterjs-editor-dom';
import { VTable } from 'roosterjs-editor-dom';

const CELL_SHADE = 'cellShade';

/**
 * Format table
 * @param editor The editor which contains the table to format
 * @param format A TableFormat object contains format information we want to apply to the table
 * @param table The table to format. This is optional. When not passed, the current table (if any) will be formatted
 */
export default function formatTable(
    editor: IEditor,
    format: TableFormat,
    table?: HTMLTableElement
) {
    table = table || (editor.getElementAtCursor('TABLE') as HTMLTableElement);
    if (table) {
        editor.addUndoSnapshot((start, end) => {
            saveTableInfo(table, format);
            let vtable = new VTable(table);
            deleteCellShadeDataset(vtable);
            vtable.applyFormat(format);
            vtable.writeBack();
            editor.focus();
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}

function deleteCellShadeDataset(vtable: VTable) {
    vtable.cells.forEach(row => {
        row.forEach(cell => {
            if (cell.td && cell.td.dataset[CELL_SHADE]) {
                delete cell.td.dataset[CELL_SHADE];
            }
        });
    });
}
