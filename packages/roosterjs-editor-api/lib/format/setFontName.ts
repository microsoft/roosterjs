import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set font name at selection
 * @param editor The editor instance
 * @param fontName The fontName string, should be a valid CSS font-family style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setFontName(editor: Editor, fontName: string) {
    editor.focus();
    execFormatWithUndo(editor, () => {
        // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
        // (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
        // for here, we use CSS font-family style
        editor.applyInlineStyle((element: HTMLElement) => {
            element.style.fontFamily = fontName;
        });
    });
}
