import getNodeAtCursor from '../format/getNodeAtCursor';
import { Editor } from 'roosterjs-editor-core';
import { VTable } from 'roosterjs-editor-dom';
import { TableFormat, ChangeSource } from 'roosterjs-editor-types';

/**
 * Format table
 * @param editor The editor which contains the table to format
 * @param format A TableFormat object contains format information we want to apply to the table
 * @param table The table to format. This is optional. When not passed, the current table (if any) will be formatted
 */
export default function formatTable(
    editor: Editor,
    format: Partial<TableFormat>,
    table?: HTMLTableElement
) {
    table = table || (getNodeAtCursor(editor, 'TABLE') as HTMLTableElement);
    if (table) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(table);
            vtable.applyFormat(format);
            vtable.writeBack();
            editor.focus();
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}
