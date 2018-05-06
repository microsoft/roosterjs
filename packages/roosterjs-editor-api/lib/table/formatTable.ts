import VTable from './VTable';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor } from 'roosterjs-editor-core';
import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format table
 * @param table The table to format
 * @param formatName Name of the format to use
 */
export default function formatTable(editor: Editor, format: TableFormat, table?: HTMLTableElement) {
    let td = table
        ? table.rows[0].cells[0]
        : (getNodeAtCursor(editor, ['TD', 'TH']) as HTMLTableCellElement);
    if (td) {
        editor.formatWithUndo(() => {
            let vtable = new VTable(td);
            vtable.applyFormat(format);
            vtable.writeBack();
            td = editor.contains(td) ? td : vtable.getCurrentTd();
            editor.focus();
            return td;
        }, true /*preserveSelection*/);
    }
}
