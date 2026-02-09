import { BorderColorKeyMap } from './borderKeys';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import type {
    DarkColorHandler,
    Colors,
    ColorTransformFunction,
    BorderKey,
} from 'roosterjs-content-model-types';

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
const HEX3_REGEX = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/;
const HEX6_REGEX = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/;
const RGB_REGEX = /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
const RGBA_REGEX = /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
const VARIABLE_REGEX = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';
const VARIABLE_POSTFIX = ')';
const COLOR_VAR_PREFIX = '--darkColor';

/**
 * Get color from given HTML element
 * @param element The element to get color from
 * @param isBackground True to get background color, false to get text color
 * @param isDarkMode Whether element is in dark mode now
 * @param darkColorHandler @optional The dark color handler object to help manager dark mode color
 * @param fallback @optional Fallback color to use if no color is found from the element
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    isDarkMode: boolean,
    darkColorHandler?: DarkColorHandler,
    fallback?: string
): string | undefined {
    const color = retrieveElementColor(element, isBackground ? 'background' : 'text', fallback);

    return color
        ? getLightModeColor(
              color,
              isDarkMode,
              darkColorHandler,
              isBackground ? undefined : BlackColor
          )
        : undefined;
}

/**
 * @internal
 */
export function getLightModeColor(
    color: string,
    isDarkMode: boolean,
    darkColorHandler?: DarkColorHandler,
    fallback?: string
) {
    if (DeprecatedColors.indexOf(color) > -1) {
        return fallback;
    } else {
        const match = color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;

        if (match) {
            color = match[2] || '';
        } else if (isDarkMode && darkColorHandler) {
            // If editor is in dark mode but the color is not in dark color format, it is possible the color was inserted from external code
            // without any light color info. So we first try to see if there is a known dark color can match this color, and use its related
            // light color as light mode color. Otherwise we need to drop this color to avoid show "white on white" content.
            return findLightColorFromDarkColor(color, darkColorHandler.knownColors) || '';
        }
    }
    return color;
}

/**
 * @internal
 */
export function retrieveElementColor(
    element: HTMLElement,
    source: 'text' | 'background' | BorderKey,
    fallback?: string
): string | undefined {
    switch (source) {
        case 'text':
            return element.style.color || element.getAttribute('color') || fallback;

        case 'background':
            return element.style.backgroundColor || element.getAttribute('bgcolor') || fallback;

        default:
            return element.style.getPropertyValue(BorderColorKeyMap[source]) || fallback;
    }
}

/**
 * Set color to given HTML element
 * @param element The element to set color to
 * @param color The color to set, always pass in color in light mode
 * @param isBackground True to set background color, false to set text color
 * @param isDarkMode Whether element is in dark mode now
 * @param darkColorHandler @optional The dark color handler object to help manager dark mode color
 * @param comparingColor @optional When generating dark color for background color, we can provide text color as comparingColor to make sure the generated dark border color has enough contrast with text color in dark mode
 */
export function setColor(
    element: HTMLElement,
    color: string | null | undefined,
    isBackground: boolean,
    isDarkMode: boolean,
    darkColorHandler?: DarkColorHandler,
    comparingColor?: string
) {
    const newColor = adaptColor(
        element,
        color,
        isBackground ? 'background' : 'text',
        isDarkMode,
        darkColorHandler,
        comparingColor
    );

    element.removeAttribute(isBackground ? 'bgcolor' : 'color');
    element.style.setProperty(isBackground ? 'background-color' : 'color', newColor || null);
}

/**
 * @internal
 */
export function adaptColor(
    element: HTMLElement,
    color: string | null | undefined,
    colorType: 'text' | 'background' | 'border',
    isDarkMode: boolean,
    darkColorHandler?: DarkColorHandler,
    comparingColor?: string
) {
    const match = color && color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;
    const [_, existingKey, fallbackColor] = match ?? [];

    color = fallbackColor ?? color;

    if (darkColorHandler && color) {
        const key =
            existingKey ||
            darkColorHandler.generateColorKey(
                color,
                undefined /*baseLValue*/,
                colorType,
                element,
                comparingColor
            );
        const darkModeColor =
            darkColorHandler.knownColors?.[key]?.darkModeColor ||
            darkColorHandler.getDarkColor(
                color,
                undefined /*baseLValue*/,
                colorType,
                element,
                comparingColor
            );

        darkColorHandler.updateKnownColor(isDarkMode, key, {
            lightModeColor: color,
            darkModeColor,
        });

        color = isDarkMode ? `${VARIABLE_PREFIX}${key}, ${color}${VARIABLE_POSTFIX}` : color;
    }

    return color;
}

/**
 * Generate color key for dark color
 * @param lightColor The input light color
 * @returns Key of the color
 */
export const defaultGenerateColorKey: ColorTransformFunction = (
    lightColor,
    _1,
    _2,
    _3,
    comparingColor
) => {
    const comparingColorKey = comparingColor ? `_${comparingColor.replace(/[^\d\w]/g, '_')}` : '';
    return `${COLOR_VAR_PREFIX}_${lightColor.replace(/[^\d\w]/g, '_')}${comparingColorKey}`;
};

/**
 * Parse color string to r/g/b value.
 * If the given color is not in a recognized format, return null
 * @param color The source color to parse
 * @returns An array of Red/Green/Blue value, or null if fail to parse
 */
export function parseColor(color: string): [number, number, number] | null {
    color = (color || '').trim();

    let match: RegExpMatchArray | null;
    if ((match = color.match(HEX3_REGEX))) {
        return [
            parseInt(match[1] + match[1], 16),
            parseInt(match[2] + match[2], 16),
            parseInt(match[3] + match[3], 16),
        ];
    } else if ((match = color.match(HEX6_REGEX))) {
        return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
    } else if ((match = color.match(RGB_REGEX) || color.match(RGBA_REGEX))) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    } else {
        // CSS color names such as red, green is not included for now.
        // If need, we can add those colors from https://www.w3.org/wiki/CSS/Properties/color/keywords
        return null;
    }
}

function findLightColorFromDarkColor(
    darkColor: string,
    knownColors?: Record<string, Colors>
): string | null {
    const rgbSearch = parseColor(darkColor);

    if (rgbSearch && knownColors) {
        const key = getObjectKeys(knownColors).find(key => {
            const rgbCurrent = parseColor(knownColors[key].darkModeColor);

            return (
                rgbCurrent &&
                rgbCurrent[0] == rgbSearch[0] &&
                rgbCurrent[1] == rgbSearch[1] &&
                rgbCurrent[2] == rgbSearch[2]
            );
        });

        if (key) {
            return knownColors[key].lightModeColor;
        }
    }

    return null;
}
