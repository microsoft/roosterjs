import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { safeInstanceOf, setColor } from 'roosterjs-editor-dom';

const TEMP_BACKGROUND_COLOR = 'originalBackgroundColor';
const CELL_SHADE = 'cellShade';

/**
 * Set background color of cells.
 * @param editor The editor instance
 * @param color One of two options:
 **/
export default function applyCellShading(editor: IEditor, color: string | ModeIndependentColor) {
    editor.focus();
    formatUndoSnapshot(
        editor,
        () => {
            const regions = editor.getSelectedRegions();
            regions.forEach(region => {
                if (safeInstanceOf(region.rootNode, 'HTMLTableCellElement')) {
                    setColor(
                        region.rootNode,
                        color,
                        true /* isBackgroundColor */,
                        editor.isDarkMode(),
                        true /** shouldAdaptFontColor */
                    );
                    region.rootNode.dataset[CELL_SHADE] = 'true';

                    region.rootNode.dataset[TEMP_BACKGROUND_COLOR] =
                        region.rootNode.style.backgroundColor;
                }
            });
        },
        'applyCellShading'
    );
}
