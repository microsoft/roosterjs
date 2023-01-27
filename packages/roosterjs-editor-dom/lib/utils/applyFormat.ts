import setColor from './setColor';
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
            setColor(
                element,
                textColors,
                false /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
        } else if (textColor) {
            setColor(
                element,
                textColor,
                false /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
        }

        if (backgroundColors) {
            setColor(
                element,
                backgroundColors,
                true /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
        } else if (backgroundColor) {
            setColor(
                element,
                backgroundColor,
                true /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
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
