import applyInlineStyle from '../utils/applyInlineStyle';
import { applyStyleToListItems } from '../utils/applyStyleToListItems';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Set font name at selection
 * @param editor The editor instance
 * @param fontName The fontName string, should be a valid CSS font-family style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontName(editor: IEditor, fontName: string) {
    const parentNodes: Node[] = [];
    fontName = fontName.trim();
    // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
    // (http://www.w3schools.com/tags/tag_font.asp). Use applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-family style
    applyInlineStyle(editor, (element, isInnerNode) => {
        element.style.fontFamily = isInnerNode ? '' : fontName;

        if (parentNodes.indexOf(element.parentNode) === -1) {
            parentNodes.push(element.parentNode);
        }
    });

    applyStyleToListItems(parentNodes, ['font-family']);
}
