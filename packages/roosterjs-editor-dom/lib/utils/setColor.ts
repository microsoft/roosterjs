import { ModeIndependentColor } from 'roosterjs-editor-types';

const WHITE = '#ffffff';
const GRAY = '#333333';
const BLACK = '#000000';
const TRANSPARENT = 'transparent';
const TEXT_COLOR_FOR_DARK: ModeIndependentColor = {
    lightModeColor: WHITE,
    darkModeColor: GRAY,
};
const TEXT_COLOR_FOR_LIGHT: ModeIndependentColor = {
    lightModeColor: BLACK,
    darkModeColor: WHITE,
};

//Using the HSL (hue, saturation and lightness) representation for RGB color values, if the value of the lightness is less than 20, the color is dark
const DARK_COLORS_LIGHTNESS = 20;
//If the value of the lightness is more than 80, the color is bright
const BRIGHT_COLORS_LIGHTNESS = 80;

/**
 * @deprecated Use IEditor.setColorToElement() instead
 */
export default function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackgroundColor: boolean,
    isDarkMode?: boolean,
    shouldAdaptTheFontColor?: boolean
) {
    const colorString = typeof color === 'string' ? color.trim() : '';
    const modeIndependentColor = typeof color === 'string' ? null : color;

    if (colorString || modeIndependentColor) {
        element.style.setProperty(
            isBackgroundColor ? 'background-color' : 'color',
            (isDarkMode
                ? modeIndependentColor?.darkModeColor
                : modeIndependentColor?.lightModeColor) || colorString
        );

        if (isBackgroundColor && shouldAdaptTheFontColor) {
            adaptFontColorToBackgroundColor(
                element,
                modeIndependentColor?.lightModeColor || colorString,
                isDarkMode
            );
        }
    }
}

/**
 * Change the font color to white or some other color, so the text can be visible with a darker background
 * @param element The element that contains text.
 */
function adaptFontColorToBackgroundColor(
    element: HTMLElement,
    lightModelBackColor: string,
    isDarkMode?: boolean
) {
    const textColor = getTextColorForBackground(lightModelBackColor);

    if (textColor) {
        setColor(element, textColor, false /*isBackground*/, isDarkMode);
    }
}

/**
 * Given a light mode background color, check if it is too bright or too dark, and return a proper text color, or null
 * @param lightModelBackColor The light mode background color
 * @returns The suggested text color
 */
export function getTextColorForBackground(
    lightModelBackColor: string
): ModeIndependentColor | null {
    if (!lightModelBackColor || lightModelBackColor === TRANSPARENT) {
        return null;
    }

    const lightness = calculateLightness(lightModelBackColor);

    if (lightness < DARK_COLORS_LIGHTNESS) {
        return TEXT_COLOR_FOR_DARK;
    } else if (lightness > BRIGHT_COLORS_LIGHTNESS) {
        return TEXT_COLOR_FOR_LIGHT;
    } else {
        return null;
    }
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
    const r = parseInt(colors.substr(0, 2), 16);
    const g = parseInt(colors.substr(2, 2), 16);
    const b = parseInt(colors.substr(4, 2), 16);

    return [r, g, b];
}

function getColorsFromRGB(color: string) {
    const colors = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    ) as RegExpMatchArray;

    return colors
        ? [parseInt(colors[1]), parseInt(colors[2]), parseInt(colors[3])]
        : [255, 255, 255];
}
