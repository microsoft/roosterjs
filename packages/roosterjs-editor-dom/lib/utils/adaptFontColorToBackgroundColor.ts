const enum ColorTones {
    BRIGHT,
    DARK,
}
const LiteralDarkColor = ['black', '--ms-color-black'];
const LiteralBrightColor = ['white', '--ms-color-white'];
const WHITE = '#ffffff';
const BLACK = '#000000';

//Using the HSL (hue, saturation and lightness) representation for RGB color values, if the value of the lightness is less than 20, the color is dark
const DARK_COLORS_LIGHTNESS = 20;
//If the value of the lightness is more than 80, the color is bright
const BRIGHT_COLORS_LIGHTNESS = 80;

/**
 * @internal
 * Change the font color to white or some other color, so the text can be visible with a darker background
 * @param element The element that contains text.
 * @param backgroundColor The backgroundColor of a element
 */
export default function adaptFontColorToBackgroundColor(
    element: HTMLElement,
    backgroundColor: string
) {
    if (element.firstElementChild?.hasAttribute('style')) {
        return;
    }
    if (isADarkOrBrightColor(backgroundColor) === ColorTones.DARK) {
        element.style.color = WHITE;
    } else if (isADarkOrBrightColor(backgroundColor) === ColorTones.BRIGHT) {
        element.style.color = BLACK;
    } else {
        element.style.color = '';
    }
}

function isADarkOrBrightColor(color: string) {
    let lightness = 50; // set 50, because is not bright or dark
    if (isRGB(color) || isRGBA(color) || isHEX(color)) {
        lightness = calculateLightness(color);
    }
    if (lightness < DARK_COLORS_LIGHTNESS || LiteralDarkColor.indexOf(color) > -1) {
        return ColorTones.DARK;
    } else if (lightness > BRIGHT_COLORS_LIGHTNESS || LiteralBrightColor.indexOf(color) > -1) {
        return ColorTones.BRIGHT;
    }
}

const isRGB = (color: string) => color.includes('rgb(');
const isRGBA = (color: string) => color.includes('rgba(');
const isHEX = (color: string) => color.includes('#');

/**
 * Calculate the lightness of HSL (hue, saturation and lightness) representation
 * @param color a HEX or RBG COLOR
 * @returns
 */
function calculateLightness(color: string) {
    let r; // red
    let g; // green
    let b; // blue

    if (isRGB(color) || isRGBA(color)) {
        //if the color representation is RGB, extract the values of red, green and blue
        const colors = color.match(/[\d\.]+/g) as RegExpMatchArray;
        r = parseInt(colors[0]);
        g = parseInt(colors[1]);
        b = parseInt(colors[2]);
    } else {
        //if the color representation is HEX, transform to RGB and extract the values of red, green and blue
        if (color.length === 4) {
            color = color.replace(/(.)/g, '$1$1');
        }
        const colors = color.replace('#', '');
        r = parseInt(colors.substr(0, 2), 16);
        g = parseInt(colors.substr(2, 2), 16);
        b = parseInt(colors.substr(4, 2), 16);
    }

    // Use the values of r,g,b to calculate the lightness in the HSl representation
    //First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have
    r = r / 255;
    g = g / 255;
    b = b / 255;
    //Then the lightness in the HSL representation is the average between maximum fraction of r,g,b and the minimum fraction
    return (Math.max(r, g, b) + Math.min(r, g, b)) * (1 / 2) * 100;
}
