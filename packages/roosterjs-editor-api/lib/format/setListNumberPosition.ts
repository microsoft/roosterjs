import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { getComputedStyle, safeInstanceOf } from 'roosterjs-editor-dom';

/**
 * Resets Ordered List Numbering back to the value of the parameter startNumber
 * @param editor The editor instance
 * @param separator The HTML element that indicates when to split the VList
 * @param startNumber The number of that the splitted list should start
 */
export default function setListNumberPosition(
    editor: IEditor,
    list: HTMLOListElement,
    numberPosition: number
) {
    editor.addUndoSnapshot(() => {
        editor.focus();

        if (isRtl(list.parentNode)) {
            list.style.marginRight = `${numberPosition.toString()}px`;
        } else {
            list.style.marginLeft = `${numberPosition.toString()}px`;
        }
    }, ChangeSource.Format);
}

function isRtl(element: Node): boolean {
    return safeInstanceOf(element, 'HTMLElement')
        ? getComputedStyle(element, 'direction') == 'rtl'
        : false;
}
