import { Keys, SelectionRangeTypes } from 'roosterjs-editor-types';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { TABLE_CELL_SELECTOR } from '../constants';
import type { GenericContentEditFeature, IEditor, PluginEvent } from 'roosterjs-editor-types';

/**
 * @internal
 * Feature that when Backspace is pressed and there is Table Selection, delete the contents inside of the selection
 */
export const DeleteTableContents: GenericContentEditFeature<PluginEvent> = {
    keys: [Keys.DELETE, Keys.BACKSPACE],
    shouldHandleEvent: (_, editor: IEditor) => {
        const selection = editor.getSelectionRangeEx();
        return selection.type == SelectionRangeTypes.TableSelection;
    },
    handleEvent: (_, editor) => {
        const selection = editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.TableSelection) {
            editor.addUndoSnapshot(() => {
                if (selection.isWholeTableSelected) {
                    selection.table
                        .querySelectorAll(TABLE_CELL_SELECTOR)
                        .forEach(td => deleteNodeContents(td, editor));
                } else {
                    editor
                        .getSelectedRegions()
                        .forEach(region => deleteNodeContents(region.rootNode, editor));
                }
            });
        }
    },
};

function deleteNodeContents(element: Node, editor: IEditor) {
    if (safeInstanceOf(element, 'HTMLTableCellElement')) {
        const range = new Range();
        range.selectNodeContents(element);
        range.deleteContents();
        element.appendChild(editor.getDocument().createElement('br'));
    }
}
