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
        const formatter = (element: HTMLElement, setDataset: boolean = false) => {
            if (safeInstanceOf(element, 'HTMLTableCellElement')) {
                setColor(element, color, true, editor.isDarkMode());
                if (setDataset) {
                    element.dataset[TEMP_BACKGROUND_COLOR] = element.style.backgroundColor;
                }
            }
        };

        if (selection.type == SelectionRangeTypes.TableSelection) {
            const regions = editor.getSelectedRegions();
            regions.forEach(region => {
                formatter(region.rootNode, true);
            });
        } else {
            if (selection.areAllCollapsed) {
                const cell = editor.getElementAtCursor('td,th');
                formatter(cell);
            }
        }
    });
}
