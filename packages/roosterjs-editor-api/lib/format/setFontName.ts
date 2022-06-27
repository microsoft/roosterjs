import applyListItemStyleWrap from '../utils/applyListItemWrap';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Set font name at selection
 * @param editor The editor instance
 * @param fontName The fontName string, should be a valid CSS font-family style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontName(editor: IEditor, fontName: string) {
    // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
    // (http://www.w3schools.com/tags/tag_font.asp).
    applyListItemStyleWrap(
        editor,
        'font-family',
        (element, isInnerNode) => {
            element.style.fontFamily = isInnerNode ? '' : fontName;
        },
        'setFontName'
    );
}
