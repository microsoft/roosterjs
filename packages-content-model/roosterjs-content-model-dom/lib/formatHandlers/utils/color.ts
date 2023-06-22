import { DarkColorHandler } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    darkColorHandler: DarkColorHandler | undefined | null,
    isDarkMode: boolean
): string | undefined {
    let color: string | undefined;

    if (!color) {
        color =
            (darkColorHandler &&
                tryGetFontColor(element, isDarkMode, darkColorHandler, isBackground)) ||
            (isBackground ? element.style.backgroundColor : element.style.color) ||
            element.getAttribute(isBackground ? 'bgcolor' : 'color') ||
            undefined;
    }

    if (darkColorHandler) {
        color = darkColorHandler.parseColorValue(color).lightModeColor;
    }

    return color;
}

/**
 * @internal
 */
export function setColor(
    element: HTMLElement,
    lightModeColor: string,
    isBackground: boolean,
    darkColorHandler: DarkColorHandler | undefined | null,
    isDarkMode: boolean
) {
    const effectiveColor = darkColorHandler?.registerColor(lightModeColor, isDarkMode) || '';

    if (isBackground) {
        element.style.backgroundColor = effectiveColor;
    } else {
        element.style.color = effectiveColor;
    }
}

/**
 * There is a known issue that when input with IME in Chrome, it is possible Chrome insert a new FONT tag with colors.
 * If editor is in dark mode, this color will cause the FONT tag doesn't have light mode color info so that after convert
 * to light mode the color will be wrong.
 * To workaround it, we check if this is a known color (for light mode with VariableBasedDarkColor enabled, all used colors
 * are stored in darkColorHandler), then use the related light mode color instead.
 */
function tryGetFontColor(
    element: HTMLElement,
    isDarkMode: boolean,
    darkColorHandler: DarkColorHandler,
    isBackground: boolean
) {
    let darkColor: string | null;

    return getTagOfNode(element) == 'FONT' &&
        !element.style.getPropertyValue(isBackground ? 'background-color' : 'color') &&
        isDarkMode &&
        (darkColor = element.getAttribute(isBackground ? 'bgcolor' : 'color'))
        ? darkColorHandler.findLightColorFromDarkColor(darkColor)
        : null;
}
