import setColor from './setColor';
import { DefaultFormat, IEditor } from 'roosterjs-editor-types';

/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 */
export default function applyFormat(element: HTMLElement, format: DefaultFormat): void;

/**
 * @deprecated
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 * @param isDarkMode Whether apply format for dark mode @default false
 */
export default function applyFormat(
    element: HTMLElement,
    format: DefaultFormat,
    isDarkMode: boolean
): void;

/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 * @param editor Editor object
 */
export default function applyFormat(
    element: HTMLElement,
    format: DefaultFormat,
    editor: IEditor
): void;

export default function applyFormat(
    element: HTMLElement,
    format: DefaultFormat,
    editorOrIsDarkMode?: IEditor | boolean
) {
    if (format) {
        const elementStyle = element.style;
        const { fontFamily, fontSize, bold, italic, underline } = format;
        const textColor = format.textColors || format.textColor;
        const backColor = format.backgroundColors || format.backgroundColor;

        if (fontFamily) {
            elementStyle.fontFamily = fontFamily;
        }
        if (fontSize) {
            elementStyle.fontSize = fontSize;
        }

        if (typeof editorOrIsDarkMode == 'object') {
            if (textColor) {
                editorOrIsDarkMode.setColorToElement(element, textColor, 'color');
            }
            if (backColor) {
                editorOrIsDarkMode.setColorToElement(element, backColor, 'background-color');
            }
        } else {
            if (textColor) {
                setColor(element, textColor, false /*isBackground*/, editorOrIsDarkMode);
            }
            if (backColor) {
                setColor(element, backColor, true /*isBackground*/, editorOrIsDarkMode);
            }
        }

        if (bold) {
            elementStyle.fontWeight = 'bold';
        }
        if (italic) {
            elementStyle.fontStyle = 'italic';
        }
        if (underline) {
            elementStyle.textDecoration = 'underline';
        }
    }
}
