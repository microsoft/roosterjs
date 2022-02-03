import { IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { safeInstanceOf, setColor } from 'roosterjs-editor-dom';

const TEMP_BACKGROUND_COLOR = 'originalBackgroundColor';

/**
 * Set background color of cells.
 * @param editor The editor instance
 * @param color One of two options:
 **/
export default function applyCellShading(editor: IEditor, color: string | ModeIndependentColor) {
    const selection = editor.getSelectionRangeEx();
    if (selection) {
        editor.focus();
        editor.addUndoSnapshot(() => {
            const regions = editor.getSelectedRegions();
            regions.forEach(region => {
                if (safeInstanceOf(region.rootNode, 'HTMLTableCellElement')) {
                    setColor(
                        region.rootNode,
                        color,
                        true /* isBackgroundColor */,
                        editor.isDarkMode()
                    );

                    region.rootNode.dataset[TEMP_BACKGROUND_COLOR] =
                        region.rootNode.style.backgroundColor;
                }
            });
        });
    }
}
