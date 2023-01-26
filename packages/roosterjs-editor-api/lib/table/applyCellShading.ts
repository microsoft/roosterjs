import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { safeInstanceOf, saveTableCellMetadata, setColor } from 'roosterjs-editor-dom';

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
                        true /** shouldAdaptFontColor */,
                        editor.getDarkColorHandler()
                    );
                    saveTableCellMetadata(region.rootNode, { bgColorOverride: true });
                }
            });
        },
        'applyCellShading'
    );
}
