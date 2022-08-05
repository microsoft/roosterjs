import { BackgroundColorKeys } from '../types/stringKeys';
import { ModeIndependentColor } from 'roosterjs-editor-types';

/**
 * @internal
 */
const BackgroundColors: Record<BackgroundColorKeys, ModeIndependentColor> = {
    backgroundColorCyan: { lightModeColor: '#00ffff', darkModeColor: '#005357' },
    backgroundColorGreen: { lightModeColor: '#00ff00', darkModeColor: '#005e00' },
    backgroundColorYellow: { lightModeColor: '#ffff00', darkModeColor: '#383e00' },
    backgroundColorOrange: { lightModeColor: '#ff8000', darkModeColor: '#bf4c00' },
    backgroundColorRed: { lightModeColor: '#ff0000', darkModeColor: '#ff2711' },
    backgroundColorMagenta: { lightModeColor: '#ff00ff', darkModeColor: '#e700e8' },
    backgroundColorLightCyan: { lightModeColor: '#80ffff', darkModeColor: '#004c4f' },
    backgroundColorLightGreen: { lightModeColor: '#80ff80', darkModeColor: '#005400' },
    backgroundColorLightYellow: { lightModeColor: '#ffff80', darkModeColor: '#343c00' },
    backgroundColorLightOrange: { lightModeColor: '#ffc080', darkModeColor: '#77480b' },
    backgroundColorLightRed: { lightModeColor: '#ff8080', darkModeColor: '#bc454a' },
    backgroundColorLightMagenta: { lightModeColor: '#ff80ff', darkModeColor: '#aa2bad' },
    backgroundColorWhite: { lightModeColor: '#ffffff', darkModeColor: '#333333' },
    backgroundColorLightGray: { lightModeColor: '#cccccc', darkModeColor: '#535353' },
    backgroundColorGray: { lightModeColor: '#999999', darkModeColor: '#777777' },
    backgroundColorDarkGray: { lightModeColor: '#666666', darkModeColor: '#a0a0a0' },
    backgroundColorDarkerGray: { lightModeColor: '#333333', darkModeColor: '#cfcfcf' },
    backgroundColorBlack: { lightModeColor: '#000000', darkModeColor: '#ffffff' },
};

/**
 * @internal
 * List of colors in drop down list
 */
const BackgroundColorDropDownItems: Record<BackgroundColorKeys, string> = {
    backgroundColorCyan: 'Cyan',
    backgroundColorGreen: 'Green',
    backgroundColorYellow: 'Yellow',
    backgroundColorOrange: 'Orange',
    backgroundColorRed: 'Red',
    backgroundColorMagenta: 'Magenta',
    backgroundColorLightCyan: 'Light cyan',
    backgroundColorLightGreen: 'Light green',
    backgroundColorLightYellow: 'Light yellow',
    backgroundColorLightOrange: 'Light orange',
    backgroundColorLightRed: 'Light red',
    backgroundColorLightMagenta: 'Light magenta',
    backgroundColorWhite: 'White',
    backgroundColorLightGray: 'Light gray',
    backgroundColorGray: 'Gray',
    backgroundColorDarkGray: 'Dark gray',
    backgroundColorDarkerGray: 'Darker gray',
    backgroundColorBlack: 'Black',
};

/**
 * Get mode independent color value of background color from the given color key
 * @param key The key to get color from
 * @returns A model independent color value of the given key
 */
function getBackgroundColorValue(key: BackgroundColorKeys): ModeIndependentColor {
    return BackgroundColors[key];
}

export { BackgroundColors, BackgroundColorDropDownItems, getBackgroundColorValue };
