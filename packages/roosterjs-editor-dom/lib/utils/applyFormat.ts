import { DarkColorHandler, DefaultFormat } from 'roosterjs-editor-types';

/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 * @param isDarkMode Whether the content should be formatted in dark mode
 * @param darkColorHandler An optional dark color handler object. When it is passed, we will use this handler to do variable-based dark color instead of original dataset base dark color
 */
export default function applyFormat(
    element: HTMLElement,
    format: DefaultFormat,
    isDarkMode?: boolean,
    darkColorHandler?: DarkColorHandler | null
) {
    if (format) {
        let elementStyle = element.style;
        let { fontFamily, fontSize, bold, italic, underline } = format;

        if (fontFamily) {
            elementStyle.fontFamily = fontFamily;
        }
        if (fontSize) {
            elementStyle.fontSize = fontSize;
        }

        const textColor = format.textColors || format.textColor;
        const bgColor = format.backgroundColors || format.backgroundColor;

        textColor &&
            darkColorHandler?.setColor(element, false /*isBackground*/, textColor, isDarkMode);
        bgColor && darkColorHandler?.setColor(element, true /*isBackground*/, bgColor, isDarkMode);

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
