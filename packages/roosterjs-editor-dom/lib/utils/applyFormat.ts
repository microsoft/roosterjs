import setColor from './setColor';
import { DefaultFormat } from 'roosterjs-editor-types';

/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 */
export default function applyFormat(
    element: HTMLElement,
    format: DefaultFormat,
    isDarkMode?: boolean
) {
    if (format) {
        let elementStyle = element.style;
        let {
            fontFamily,
            fontSize,
            textColor,
            textColors,
            backgroundColor,
            backgroundColors,
            bold,
            italic,
            underline,
        } = format;

        if (fontFamily) {
            elementStyle.fontFamily = fontFamily;
        }
        if (fontSize) {
            elementStyle.fontSize = fontSize;
        }

        if (textColors) {
            setColor(element, textColors, false /*isBackground*/, isDarkMode);
        } else if (textColor) {
            setColor(element, textColor, false /*isBackground*/, isDarkMode);
        }

        if (backgroundColors) {
            setColor(element, backgroundColors, true /*isBackground*/, isDarkMode);
        } else if (backgroundColor) {
            setColor(element, backgroundColor, true /*isBackground*/, isDarkMode);
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
