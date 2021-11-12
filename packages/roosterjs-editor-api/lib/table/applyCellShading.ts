import { ChangeSource, IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * Apply cell shading on a vTable selection
 * @param editor The editor which contains the table to format
 * @param color color to apply to the cells
 * @param table The table to format. This is optional. When not passed, the current table (if any) will be formatted
 */
export default function applyCellShading(
    editor: IEditor,
    color: string | ModeIndependentColor,
    table?: HTMLTableElement
) {
    table = table || (editor.getElementAtCursor('TABLE') as HTMLTableElement);
    if (table) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(table);
            vtable.setBackgroundColor(color, editor.isDarkMode());
            editor.focus();
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}
