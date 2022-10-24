import applyListItemStyleWrap from '../utils/applyListItemWrap';
import { getComputedStyle } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Set font weight at selection
 * Only sets the value if the computed weight is different
 * @param editor The editor instance
 * @param fontWeight The fontWight string, should be a valid CSS font-weight style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontWeight(editor: IEditor, fontWeight: string) {
    applyListItemStyleWrap(
        editor,
        'font-weight',
        element => {
            let computedFontWeight = getComputedStyle(element, 'font-weight');
            if (computedFontWeight !== fontWeight) {
                element.style.fontWeight = '400';
            }
        },
        'setFontWeight'
    );
}
