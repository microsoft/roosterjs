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

/**
 * @internal
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
        color = undefined;
    }

    if (darkColorHandler) {
        color = darkColorHandler.parseColorValue(color, isDarkMode).lightModeColor;
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
