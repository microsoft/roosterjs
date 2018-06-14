import { Editor } from 'roosterjs-editor-core';

/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontSize(editor: Editor, fontSize: string) {
    editor.focus();
    // TODO: Verify font size
    let validatedFontSize = fontSize.trim();
    if (validatedFontSize) {
        editor.addUndoSnapshot(() => {
            // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
            // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use CSS font-size style
            editor.applyInlineStyle((element: HTMLElement) => {
                element.style.fontSize = fontSize;
            });
        });
    }
}
