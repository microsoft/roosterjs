import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { createVListFromRegion } from 'roosterjs-editor-dom';

/**
 * Resets Ordered List Numbering back to 1
 * @param editor The editor instance
 * @param separator The HTML element that indicates when to split the VList
 * @param startNumber The number of that the splitted list should start
 */
export default function setOrderedListNumbering(
    editor: IEditor,
    separator: HTMLLIElement,
    startNumber: number
): void;
export default function setOrderedListNumbering(
    editor: IEditor,
    separator: HTMLLIElement,
    startNumber: number = 1
) {
    editor.addUndoSnapshot(() => {
        editor.focus();
        const regions = editor.getSelectedRegions();
        regions.forEach(region => {
            const vList = createVListFromRegion(region, true, separator /*includeSiblingLists*/);
            if (vList) {
                if (separator != vList.items[1].getNode()) {
                    vList.split(separator);
                    vList.writeBack();
                }

                separator.parentElement.setAttribute('start', startNumber.toString());
            }
        });
    }, ChangeSource.Format);
}
