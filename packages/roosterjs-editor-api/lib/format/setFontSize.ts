import { Editor } from 'roosterjs-editor-core';

/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontSize(editor: Editor, fontSize: string) {
    fontSize = fontSize.trim();
    // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
    // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-size style
    editor.applyInlineStyle(element => element.style.fontSize = fontSize);
}
