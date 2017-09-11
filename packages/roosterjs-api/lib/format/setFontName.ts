import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-core';

export default function setFontName(editor: Editor, fontName: string): void {
    editor.focus();
    // TODO: Verify font name
    let validatedFontName = fontName.trim();
    if (validatedFontName) {
        execFormatWithUndo(editor, () => {
            // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
            // (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use use CSS font-family style
            editor.applyInlineStyle((element: HTMLElement) => {
                element.style.fontFamily = validatedFontName;
            });
        });
    }
}
