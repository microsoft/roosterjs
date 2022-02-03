import { IEditor, ModeIndependentColor, SelectionRangeTypes } from 'roosterjs-editor-types';
import { safeInstanceOf, setColor } from 'roosterjs-editor-dom';

const TEMP_BACKGROUND_COLOR = 'originalBackgroundColor';

/**
 * Set background color of cells.
 * @param editor The editor instance
 * @param color One of two options:
 **/
export default function applyCellShading(editor: IEditor, color: string | ModeIndependentColor) {
    const selection = editor.getSelectionRangeEx();
    editor.focus();
    editor.addUndoSnapshot(() => {
        if (selection.type == SelectionRangeTypes.TableSelection || selection.areAllCollapsed) {
            const regions = editor.getSelectedRegions();
            regions.forEach(region => {
                if (safeInstanceOf(region.rootNode, 'HTMLTableCellElement')) {
                    setColor(region.rootNode, color, true, editor.isDarkMode());

                    region.rootNode.dataset[TEMP_BACKGROUND_COLOR] =
                        region.rootNode.style.backgroundColor;
                }
            });
        }
    });
}
