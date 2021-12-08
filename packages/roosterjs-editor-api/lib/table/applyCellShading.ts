import { ChangeSource, IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * Apply cell shading on a vTable selection
 * @param editor The editor which contains the table to format
 * @param color color to apply to the cells
 * @param element The table to format. This is optional. When not passed, the current table (if any) will be formatted
 */
export default function applyCellShading(
    editor: IEditor,
    color: string | ModeIndependentColor,
    element?: HTMLTableElement | HTMLTableCellElement
) {
    element = element || (editor.getElementAtCursor('td,th') as HTMLTableCellElement);
    if (element) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(element);
            vtable.setBackgroundColor(color, editor.isDarkMode());
            editor.focus();
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}
