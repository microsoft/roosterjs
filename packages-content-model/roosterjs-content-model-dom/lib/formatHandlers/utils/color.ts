import type { ColorManager } from 'roosterjs-content-model-types';

/**
 * List of deprecated colors
 */
export const DeprecatedColors: string[] = [
    'inactiveborder',
    'activeborder',
    'inactivecaptiontext',
    'inactivecaption',
    'activecaption',
    'appworkspace',
    'infobackground',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'infotext',
    'menutext',
    'menu',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedfhadow',
    'windowtext',
    'windowframe',
    'window',
];

const BlackColor = 'rgb(0, 0, 0)';

/**
 * Get color from given HTML element
 * @param element The element to get color from
 * @param isBackground True to get background color, false to get text color
 * @param darkColorHandler The dark color handler object to help manager dark mode color
 * @param isDarkMode Whether element is in dark mode now
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    darkColorHandler: ColorManager | undefined,
    isDarkMode: boolean
): string | undefined {
    let color =
        (isBackground ? element.style.backgroundColor : element.style.color) ||
        element.getAttribute(isBackground ? 'bgcolor' : 'color') ||
        undefined;

    if (color && DeprecatedColors.indexOf(color) > -1) {
        color = isBackground ? undefined : BlackColor;
    }

    if (darkColorHandler) {
        color = darkColorHandler.parseColorValue(color, isDarkMode).lightModeColor;
    }

    return color;
}

/**
 * Set color to given HTML element
 * @param element The element to set color to
 * @param lightModeColor The color to set, always pass in color in light mode
 * @param isBackground True to set background color, false to set text color
 * @param darkColorHandler The dark color handler object to help manager dark mode color
 * @param isDarkMode Whether element is in dark mode now
 */
export function setColor(
    element: HTMLElement,
    lightModeColor: string,
    isBackground: boolean,
    darkColorHandler: ColorManager | undefined,
    isDarkMode: boolean
) {
    const effectiveColor = darkColorHandler
        ? darkColorHandler.registerColor(lightModeColor, isDarkMode)
        : lightModeColor;

    if (isBackground) {
        element.style.backgroundColor = effectiveColor;
    } else {
        element.style.color = effectiveColor;
    }
}
