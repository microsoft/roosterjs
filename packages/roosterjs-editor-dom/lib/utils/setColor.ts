import parseColor from '../utils/parseColor';
import { DarkColorHandler, ModeIndependentColor } from 'roosterjs-editor-types';

type ColorAttrType = 'css' | 'html';
const TextColorAttributeName: Record<ColorAttrType, string> = {
    css: 'color',
    html: 'color',
};
const BackColorAttributeName: Record<ColorAttrType, string> = {
    css: 'background-color',
    html: 'bgcolor',
};
const WHITE = '#ffffff';
const BLACK = '#000000';
const TRANSPARENT = 'transparent';

//Using the HSL (hue, saturation and lightness) representation for RGB color values, if the value of the lightness is less than 20, the color is dark
const DARK_COLORS_LIGHTNESS = 20;
//If the value of the lightness is more than 80, the color is bright
const BRIGHT_COLORS_LIGHTNESS = 80;

/**
 * Set text color or background color to the given element
 * @param element The element to set color to
 * @param color The color to set, it can be a string of color name/value or a ModeIndependentColor object
 * @param isBackground Whether set background color or text color
 * @param isDarkMode This parameter is deprecated and is not used any more
 * @param adjustTextColor Whether the font color needs to be adapted to be visible in a dark or bright background color. @default false
 * @param darkColorHandler A dark color handler object. This is now required.
 * We keep it optional only for backward compatibility. If it is not passed, color will not be set.
 */
export default function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackground: boolean,
    isDarkMode?: boolean,
    adjustTextColor?: boolean,
    darkColorHandler?: DarkColorHandler | null
) {
    color = typeof color == 'string' ? color : color.lightModeColor;

    internalSetColor(element, isBackground, color, darkColorHandler);

    if (isBackground && adjustTextColor && color != TRANSPARENT) {
        const lightness = calculateLightness(color);
        const textColor =
            lightness < DARK_COLORS_LIGHTNESS
                ? WHITE
                : lightness > BRIGHT_COLORS_LIGHTNESS
                ? BLACK
                : null;

        if (textColor) {
            internalSetColor(element, false /*isBackground*/, textColor, darkColorHandler);
        }
    }
}

/**
 * Get light mode color of an element, either text color or background color
 * @param element The element to get color from
 * @param isBackground Whether we want to get background color or text color
 * @param darkColorHandler @optional A DarkColorHandler to help convert dark model color back to light mode color. If not passed, we always treat the color as light mode color
 * @param ignoreUnknownColorForDark When passed together with darkColorHandler, and current color mode is dark mode, we will check if the color is in dark color format.
 * If it is not, we will first try to find if is a known dark color, then get its related light mode color. If the color is unknown, we will ignore it
 * @returns The light mode color of the given element, or empty string if the source color value is invalid (see ignoreUnknownColorForDark parameter)
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    darkColorHandler?: DarkColorHandler | null,
    ignoreUnknownColorForDark?: boolean
): string {
    const color =
        element.style.getPropertyValue(getColorAttrName(isBackground, 'css')) ??
        element.getAttribute(getColorAttrName(isBackground, 'html')) ??
        '';

    return darkColorHandler
        ? darkColorHandler.parseColorValue(color, ignoreUnknownColorForDark).lightModeColor
        : color;
}

function internalSetColor(
    element: HTMLElement,
    isBackground: boolean,
    color: string,
    darkColorHandler?: DarkColorHandler | null
) {
    const propName = getColorAttrName(isBackground, 'css');

    if (darkColorHandler) {
        color = darkColorHandler.registerColor(
            color,
            false /*isDarkMode, since we are passing in a light mode color, so we should pass false here*/
        );
    }

    if (color) {
        element.style.setProperty(propName, color);
    } else {
        element.style.setProperty(propName, null);
    }

    element.removeAttribute(getColorAttrName(isBackground, 'html'));
}

function getColorAttrName(isBackground: boolean, type: ColorAttrType) {
    return (isBackground ? BackColorAttributeName : TextColorAttributeName)[type];
}

/**
 * Calculate lightness of a color
 * @param color The color to calculate
 * @returns Lightness value of the color, from 0 (darkest) to 255 (lightest)
 */
function calculateLightness(color: string) {
    const colorValues = parseColor(color);

    // Use the values of r,g,b to calculate the lightness in the HSl representation
    // First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have
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
