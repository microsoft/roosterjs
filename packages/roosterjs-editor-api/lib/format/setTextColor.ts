import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set text color at selection
 * @param editor The editor instance
 * @param color The color string
 */
export default function setTextColor(editor: Editor, color: string): void {
    editor.focus();
    // TODO: Verify color
    let validatedColor = color.trim();
    if (validatedColor) {
        execFormatWithUndo(editor, () => {
            editor.applyInlineStyle((element: HTMLElement) => {
                element.style.color = validatedColor;
            });
        });
    }
}
