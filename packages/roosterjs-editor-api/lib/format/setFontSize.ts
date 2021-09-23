import applyInlineStyle from '../utils/applyInlineStyle';
import setElementsToVerifyStyle from '../utils/setElementsToVerifyStyle';
import { applyStyleToListItems } from '../utils/applyStyleToListItems';
import { getComputedStyle } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontSize(editor: IEditor, fontSize: string) {
    const parentNodes: Node[] = [];
    fontSize = fontSize.trim();
    const contentDiv = editor.getSelectedRegions()[0]?.rootNode;

    // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
    // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-size style
    applyInlineStyle(editor, (element, isInnerNode) => {
        element.style.fontSize = isInnerNode ? '' : fontSize;
        let lineHeight = getComputedStyle(element, 'line-height');
        if (lineHeight != 'normal') {
            element.style.lineHeight = 'normal';
        }

        setElementsToVerifyStyle(parentNodes, element, contentDiv, 'LI');
    });

    applyStyleToListItems(parentNodes, ['font-size']);
}
