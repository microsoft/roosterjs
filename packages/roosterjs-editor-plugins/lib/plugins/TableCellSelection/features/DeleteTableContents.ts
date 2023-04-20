import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

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
                editor.getSelectedRegions().forEach(region => {
                    if (safeInstanceOf(region.rootNode, 'HTMLTableCellElement')) {
                        deleteNodeContents(region.rootNode, editor);
                    }
                });
            });
        }
    },
};

function deleteNodeContents(element: HTMLElement, editor: IEditor) {
    const range = new Range();
    range.selectNodeContents(element);
    range.deleteContents();
    element.appendChild(editor.getDocument().createElement('br'));
}
