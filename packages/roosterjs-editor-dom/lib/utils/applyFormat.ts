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
        if (textColor || textColors) {
            if (textColors && isDarkMode) {
                element.dataset.ogsc = textColors.lightModeColor;
            }
            elementStyle.color = textColor;
        }
        if (backgroundColor || backgroundColors) {
            if (backgroundColors && isDarkMode) {
                element.dataset.ogsb = backgroundColors.lightModeColor;
            }
            elementStyle.backgroundColor = backgroundColor;
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
