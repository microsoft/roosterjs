import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor } from 'roosterjs-editor-core';
import { VTable } from 'roosterjs-editor-dom';
import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format table
 * @param table The table to format
 * @param formatName Name of the format to use
 */
export default function formatTable(editor: Editor, format: TableFormat, table?: HTMLTableElement) {
    table = table || (getNodeAtCursor(editor, 'TABLE') as HTMLTableElement);
    if (table) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(table);
            vtable.applyFormat(format);
            vtable.writeBack();
            editor.focus();
            editor.select(start, end);
        });
    }
}
