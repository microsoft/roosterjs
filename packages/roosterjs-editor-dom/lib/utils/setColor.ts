import {
    DarkColorHandler,
    DarkModeDatasetNames,
    ModeIndependentColor,
} from 'roosterjs-editor-types';

const WHITE = '#ffffff';
const GRAY = '#333333';
const BLACK = '#000000';
const TRANSPARENT = 'transparent';
const enum ColorTones {
    BRIGHT,
    DARK,
    NONE,
}

//Using the HSL (hue, saturation and lightness) representation for RGB color values, if the value of the lightness is less than 20, the color is dark
const DARK_COLORS_LIGHTNESS = 20;
//If the value of the lightness is more than 80, the color is bright
const BRIGHT_COLORS_LIGHTNESS = 80;
const TRANSPARENT_COLOR = 'transparent';

/**
 * Set text color or background color to the given element
 * @param element The element to set color to
 * @param color The color to set, it can be a string of color name/value or a ModeIndependentColor object
 * @param isBackgroundColor Whether set background color or text color
 * @param isDarkMode Whether current mode is dark mode. @default false
 * @param shouldAdaptTheFontColor Whether the font color needs to be adapted to be visible in a dark or bright background color. @default false
 * @param darkColorHandler An optional dark color handler object. When it is passed, we will use this handler to do variable-based dark color instead of original dataset base dark color
 */
export default function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackgroundColor: boolean,
    isDarkMode?: boolean,
    shouldAdaptTheFontColor?: boolean,
    darkColorHandler?: DarkColorHandler | null
) {
    const colorString = typeof color === 'string' ? color.trim() : '';
    const modeIndependentColor = typeof color === 'string' ? null : color;
    const cssName = isBackgroundColor ? 'background-color' : 'color';

    if (colorString || modeIndependentColor) {
        if (darkColorHandler) {
            const colorValue = darkColorHandler.registerColor(
                modeIndependentColor?.lightModeColor || colorString,
                !!isDarkMode,
                modeIndependentColor?.darkModeColor
            );

            element.style.setProperty(cssName, colorValue);
        } else {
            element.style.setProperty(
                cssName,
                (isDarkMode
                    ? modeIndependentColor?.darkModeColor
                    : modeIndependentColor?.lightModeColor) || colorString
            );

            if (element.dataset) {
                const dataSetName = isBackgroundColor
                    ? DarkModeDatasetNames.OriginalStyleBackgroundColor
                    : DarkModeDatasetNames.OriginalStyleColor;
                if (!isDarkMode || color == TRANSPARENT_COLOR) {
                    delete element.dataset[dataSetName];
                } else if (modeIndependentColor) {
                    element.dataset[dataSetName] = modeIndependentColor.lightModeColor;
                }
            }
        }

        if (isBackgroundColor && shouldAdaptTheFontColor) {
            adaptFontColorToBackgroundColor(
                element,
                modeIndependentColor?.lightModeColor || colorString,
                isDarkMode,
                darkColorHandler
            );
        }
    }
}

/**
 * Change the font color to white or some other color, so the text can be visible with a darker background
 * @param element The element that contains text.
 * @param lightModeBackgroundColor Existing background color in light mode
 * @param isDarkMode Whether the content is in dark mode
 * @param darkColorHandler An optional dark color handler object. When it is passed, we will use this handler to do variable-based dark color instead of original dataset base dark color
 */
function adaptFontColorToBackgroundColor(
    element: HTMLElement,
    lightModeBackgroundColor: string,
    isDarkMode?: boolean,
    darkColorHandler?: DarkColorHandler | null
) {
    if (!lightModeBackgroundColor || lightModeBackgroundColor === TRANSPARENT) {
        return;
    }
    const isADarkOrBrightOrNone = isADarkOrBrightColor(lightModeBackgroundColor!);
    switch (isADarkOrBrightOrNone) {
        case ColorTones.DARK:
            const fontForDark: ModeIndependentColor = {
                lightModeColor: WHITE,
                darkModeColor: GRAY,
            };
            setColor(
                element,
                fontForDark,
                false /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
            break;
        case ColorTones.BRIGHT:
            const fontForLight: ModeIndependentColor = {
                lightModeColor: BLACK,
                darkModeColor: WHITE,
            };
            setColor(
                element,
                fontForLight,
                false /*isBackground*/,
                isDarkMode,
                false /*shouldAdaptFontColor*/,
                darkColorHandler
            );
            break;
    }
}

function isADarkOrBrightColor(color: string): ColorTones {
    let lightness = calculateLightness(color);
    if (lightness < DARK_COLORS_LIGHTNESS) {
        return ColorTones.DARK;
    } else if (lightness > BRIGHT_COLORS_LIGHTNESS) {
        return ColorTones.BRIGHT;
    }

    return ColorTones.NONE;
}

/**
 * Calculate the lightness of HSL (hue, saturation and lightness) representation
 * @param color a RBG or RGBA COLOR
 * @returns
 */
function calculateLightness(color: string) {
    let r: number;
    let g: number;
    let b: number;

    if (color.substring(0, 1) == '#') {
        [r, g, b] = getColorsFromHEX(color);
    } else {
        [r, g, b] = getColorsFromRGB(color);
    }
    // Use the values of r,g,b to calculate the lightness in the HSl representation
    //First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    //Then the lightness in the HSL representation is the average between maximum fraction of r,g,b and the minimum fraction
    return (Math.max(red, green, blue) + Math.min(red, green, blue)) * 50;
}

function getColorsFromHEX(color: string) {
    if (color.length === 4) {
        color = color.replace(/(.)/g, '$1$1');
    }
    const colors = color.replace('#', '');
    let r = parseInt(colors.substr(0, 2), 16);
    let g = parseInt(colors.substr(2, 2), 16);
    let b = parseInt(colors.substr(4, 2), 16);
    return [r, g, b];
}

function getColorsFromRGB(color: string) {
    const colors = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    ) as RegExpMatchArray;
    let r = parseInt(colors[1]);
    let g = parseInt(colors[2]);
    let b = parseInt(colors[3]);
    return [r, g, b];
}
