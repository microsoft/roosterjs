import applyListItemStyleWrap from '../utils/applyListItemWrap';
import { getComputedStyle } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontSize(editor: IEditor, fontSize: string) {
    // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
    // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp).
    applyListItemStyleWrap(
        editor,
        'font-size',
        (element, isInnerNode) => {
            element.style.fontSize = isInnerNode ? '' : fontSize;
            let lineHeight = getComputedStyle(element, 'line-height');
            if (lineHeight && lineHeight != 'normal') {
                element.style.lineHeight = 'normal';
            }
        },
        'setFontSize'
    );
}
