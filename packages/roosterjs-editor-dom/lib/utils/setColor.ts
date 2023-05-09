import parseColor from './parseColor';
import { DarkColorHandler, ModeIndependentColor } from 'roosterjs-editor-types';

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

/**
 * Set text color or background color to the given element
 * @param element The element to set color to
 * @param color The color to set, it can be a string of color name/value or a ModeIndependentColor object
 * @param isBackgroundColor Whether set background color or text color
 * @param isDarkMode Whether current mode is dark mode. @default false
 * @param shouldAdaptTheFontColor Whether the font color needs to be adapted to be visible in a dark or bright background color. @default false
 * @param darkColorHandler A dark color handler object. This is now required.
 * We keep it optional only for backward compatibility. If it is not passed, color will not be set.
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
 * @param darkColorHandler A dark color handler object.  This is now required.
 * We keep it optional only for backward compatibility. If it is not passed, color will not be set.
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
    const colorValues = parseColor(color);

    // Use the values of r,g,b to calculate the lightness in the HSl representation
    //First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have
    if (colorValues) {
        const red = colorValues[0] / 255;
        const green = colorValues[1] / 255;
        const blue = colorValues[2] / 255;

        //Then the lightness in the HSL representation is the average between maximum fraction of r,g,b and the minimum fraction
        return (Math.max(red, green, blue) + Math.min(red, green, blue)) * 50;
    } else {
        return 255;
    }
}
