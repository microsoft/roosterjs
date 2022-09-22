import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { createVListFromRegion } from 'roosterjs-editor-dom';
import { ExperimentalFeatures, IEditor } from 'roosterjs-editor-types';

/**
 * Resets Ordered List Numbering back to the value of the parameter startNumber
 * @param editor The editor instance
 * @param separator The HTML element that indicates when to split the VList
 * @param startNumber The number of that the splitted list should start
 */
export default function setOrderedListNumbering(
    editor: IEditor,
    separator: HTMLLIElement,
    startNumber: number = 1
) {
    formatUndoSnapshot(
        editor,
        () => {
            editor.focus();
            const regions = editor.getSelectedRegions();
            if (regions[0]) {
                const vList = createVListFromRegion(
                    regions[0],
                    false /*includeSiblingLists*/,
                    separator
                );
                if (vList) {
                    vList.split(separator, startNumber);
                    vList.writeBack(
                        editor.isFeatureEnabled(ExperimentalFeatures.ReuseAllAncestorListElements)
                    );
                }
            }
        },
        'setOrderedListNumbering'
    );
}
