import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor, TableFormat } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

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
        formatUndoSnapshot(
            editor,
            (start, end) => {
                if (!table) {
                    return;
                }

                let vtable = new VTable(table);
                vtable.applyFormat(format);
                vtable.writeBack(false /** skipApplyFormat */, editor.getDarkColorHandler());
                editor.transformToDarkColor(vtable.table);
                editor.focus();
                if (start && end) {
                    editor.select(start, end);
                }
            },
            'formatTable'
        );
    }
}
