const TRANSPARENT = 'transparent';
const DARK = 'DARK';
const BRIGHT = 'BRIGHT';
const DEFAULT = 'DEFAULT';

/**
 * Change the font color to white or some other color, so the text can be visible with a darker background
 * @param element The element that contains text.
 * @param newColor The font color to be applied. If not defined, the font color will be white.
 */
export default function adaptFontColorToBackgroundColor(
    element: HTMLElement,
    newFontColorInDark?: string,
    newFontColorInBright?: string
) {
    if (
        element.getElementsByTagName('span')[0] &&
        element.getElementsByTagName('span')[0].style.color
    ) {
        return;
    }
    const backgroundColor = element.style.backgroundColor;
    applyFontColor[isBrightOrDark(backgroundColor)](
        element,
        newFontColorInDark,
        newFontColorInBright
    );
}

const applyFontColor: Record<
    string,
    (element: HTMLElement, newFontColorInDark?: string, newFontColorInBright?: string) => void
> = {
    DARK: (element, newFontColorInDark) => (element.style.color = newFontColorInDark || '#ffffff'),
    BRIGHT: (element, newFontColorInBright) =>
        (element.style.color = newFontColorInBright || '#000000'),
    DEFAULT: element => (element.style.color = ''),
};

function isBrightOrDark(color: string) {
    const lightness = calculateLightness(color);
    if (lightness < 19) {
        return DARK;
    } else if (lightness > 79) {
        return BRIGHT;
    } else {
        return DEFAULT;
    }
}

function calculateLightness(color: string) {
    if (color === TRANSPARENT) {
        return DEFAULT;
    }
    const isRGB = color.includes('rgb(');
    const isRGBA = color.includes('rgba(');
    let r;
    let g;
    let b;
    if (isRGB || isRGBA) {
        const separator = isRGB ? 'rgb(' : 'rgba(';
        const colors = color.split(separator)[1].split(')')[0];
        r = parseInt(colors.split(',')[0]);
        g = parseInt(colors.split(',')[1]);
        b = parseInt(colors.split(',')[2]);
    } else {
        let colors = color.replace('#', '');
        if (colors.length === 3) {
            colors = colors.replace(/(.)/g, '$1$1');
        }
        r = parseInt(colors.substr(0, 2), 16);
        g = parseInt(colors.substr(2, 2), 16);
        b = parseInt(colors.substr(4, 2), 16);
    }
    r = r / 255;
    g = g / 255;
    b = b / 255;
    return (Math.max(r, g, b) + Math.min(r, g, b)) * (1 / 2) * 100;
}
