import { ChangeSource, TableOperation } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { VTable } from 'roosterjs-editor-dom';

/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
export default function editTable(editor: Editor, operation: TableOperation) {
    let td = editor.getElementAtCursor('TD,TH') as HTMLTableCellElement;
    if (td) {
        editor.addUndoSnapshot((start, end) => {
            let vtable = new VTable(td);
            vtable.edit(operation);
            vtable.writeBack();
            editor.focus();

            if (!editor.select(start, end)) {
                editor.select(editor.contains(td) ? td : vtable.getCurrentTd());
            }
        }, ChangeSource.Format);
    }
}
