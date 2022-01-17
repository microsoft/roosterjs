import { ChangeSource, IEditor, TableFormat } from 'roosterjs-editor-types';
import { saveTableInfo, VTable } from 'roosterjs-editor-dom';

/**
 * Format table
 * @param editor The editor which contains the table to format
 * @param format A TableFormat object contains format information we want to apply to the table
 * @param table The table to format. This is optional. When not passed, the current table (if any) will be formatted
 */
export default function formatTable(
    editor: IEditor,
    format: Partial<TableFormat>,
    table?: HTMLTableElement
) {
    table = table || (editor.getElementAtCursor('TABLE') as HTMLTableElement);
    if (table) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(table);
            saveTableInfo(table, format);
            vtable.applyFormat(format);
            vtable.writeBack();
            editor.focus();
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}
