import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { createVListFromRegion } from 'roosterjs-editor-dom';

/**
 * Resets Ordered List Numbering back to the value of the parameter startNumber
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
        if (regions[0]) {
            const vList = createVListFromRegion(
                regions[0],
                true /*includeSiblingLists*/,
                separator
            );
            if (vList) {
                vList.split(separator, startNumber);
                vList.writeBack();
            }
        }
    }, ChangeSource.Format);
}
