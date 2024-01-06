import { getObjectKeys } from '../../domUtils/getObjectKeys';
import type { ColorPair, SnapshotsManager } from 'roosterjs-content-model-types';

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
 * @param snapshots The snapshots manager object to help manager dark mode color
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    isDarkMode: boolean,
    snapshots?: SnapshotsManager
): string | undefined {
    let color =
        (isBackground ? element.style.backgroundColor : element.style.color) ||
        element.getAttribute(isBackground ? 'bgcolor' : 'color') ||
        undefined;

    if (color && DeprecatedColors.indexOf(color) > -1) {
        color = isBackground ? undefined : BlackColor;
    }

    if (snapshots && color) {
        const match = color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;

        if (match) {
            color = match[2] || '';
        } else if (isDarkMode) {
            // If editor is in dark mode but the color is not in dark color format, it is possible the color was inserted from external code
            // without any light color info. So we first try to see if there is a known dark color can match this color, and use its related
            // light color as light mode color. Otherwise we need to drop this color to avoid show "white on white" content.
            color = findLightColorFromDarkColor(color, snapshots.getKnownColors()) || '';
        }
    }

    return color;
}

/**
 * Set color to given HTML element
 * @param element The element to set color to
 * @param color The color to set, always pass in color in light mode
 * @param isBackground True to set background color, false to set text color
 * @param isDarkMode Whether element is in dark mode now
 * @param snapshots The snapshots manager object to help manager dark mode color
 */
export function setColor(
    element: HTMLElement,
    color: string,
    isBackground: boolean,
    isDarkMode: boolean,
    snapshots?: SnapshotsManager
) {
    const match = color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;
    let key: string | undefined;

    if (match) {
        key = match[1];
        color = match[2] || '';
    }

    let darkColor = key ? snapshots?.getKnownColors()[key]?.darkColor : undefined;

    if (snapshots && color && !key) {
        key = `${COLOR_VAR_PREFIX}_${color.replace(/[^\d\w]/g, '_')}`;

        snapshots.updateKnownColor(isDarkMode, key, {
            lightColor: color,
            darkColor:
                darkColor ||
                snapshots.getDarkColor(
                    color,
                    undefined /*baseLAValue*/,
                    isBackground ? 'background' : 'text',
                    element
                ),
        });

        color = isDarkMode ? `${VARIABLE_PREFIX}${key}, ${color}${VARIABLE_POSTFIX}` : color;
    }

    if (isBackground) {
        element.style.backgroundColor = color;
    } else {
        element.style.color = color;
    }
}

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
    knownColors: Record<string, ColorPair>
): string | null {
    const rgbSearch = parseColor(darkColor);

    if (rgbSearch) {
        const key = getObjectKeys(knownColors).find(key => {
            const rgbCurrent = parseColor(knownColors[key].darkColor);

            return (
                rgbCurrent &&
                rgbCurrent[0] == rgbSearch[0] &&
                rgbCurrent[1] == rgbSearch[1] &&
                rgbCurrent[2] == rgbSearch[2]
            );
        });

        if (key) {
            return knownColors[key].lightColor;
        }
    }

    return null;
}
