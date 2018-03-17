import { DefaultFormat } from 'roosterjs-editor-types';

/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 */
export default function applyFormat(element: HTMLElement, format: DefaultFormat) {
    if (format) {
        let elementStyle = element.style;

        if (format.fontFamily) {
            elementStyle.fontFamily = format.fontFamily;
        }
        if (format.fontSize) {
            elementStyle.fontSize = format.fontSize;
        }
        if (format.textColor) {
            elementStyle.color = format.textColor;
        }
        if (format.backgroundColor) {
            elementStyle.backgroundColor = format.backgroundColor;
        }
        if (format.bold) {
            elementStyle.fontWeight = 'bold';
        }
        if (format.italic) {
            elementStyle.fontStyle = 'italic';
        }
        if (format.underline) {
            elementStyle.textDecoration = 'underline';
        }
    }
}
