import applyInlineStyle from '../utils/applyInlineStyle';
import { Editor } from 'roosterjs-editor-core';

export interface ColorTuple {
    lightMode: string;
    darkMode: string;
}

/**
 * Set text color at selection
 * @param editor The editor instance
 * @param color The color string, can be any of the predefined color names (e.g, 'red')
 * or hexadecimal color string (e.g, '#FF0000') or rgb value (e.g, 'rgb(255, 0, 0)') supported by browser.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setTextColor(editor: Editor, color: string, ogsc?: string) {
    color = color.trim();
    applyInlineStyle(editor, element => {
        element.style.color = color;
        if (ogsc) {
            element.dataset.ogsc = ogsc.trim();
        }
    });
}
