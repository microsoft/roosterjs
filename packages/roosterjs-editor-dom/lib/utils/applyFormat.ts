import { DefaultFormat } from 'roosterjs-editor-types';

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
