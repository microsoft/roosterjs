import { ModeIndependentColor } from 'roosterjs-editor-types';
import { TextColorKeys } from '../types/stringKeys';

/**
 * @internal
 */
const TextColors: Record<TextColorKeys, ModeIndependentColor> = {
    textColorLightBlue: { lightModeColor: '#51a7f9', darkModeColor: '#0075c2' },
    textColorLightGreen: { lightModeColor: '#6fc040', darkModeColor: '#207a00' },
    textColorLightYellow: { lightModeColor: '#f5d427', darkModeColor: '#5d4d00' },
    textColorLightOrange: { lightModeColor: '#f3901d', darkModeColor: '#ab5500' },
    textColorLightRed: { lightModeColor: '#ed5c57', darkModeColor: '#df504d' },
    textColorLightPurple: { lightModeColor: '#b36ae2', darkModeColor: '#ab63da' },
    textColorBlue: { lightModeColor: '#0c64c0', darkModeColor: '#6da0ff' },
    textColorGreen: { lightModeColor: '#0c882a', darkModeColor: '#3da848' },
    textColorYellow: { lightModeColor: '#dcbe22', darkModeColor: '#6d5c00' },
    textColorOrange: { lightModeColor: '#de6a19', darkModeColor: '#d3610c' },
    textColorRed: { lightModeColor: '#c82613', darkModeColor: '#ff6847' },
    textColorPurple: { lightModeColor: '#763e9b', darkModeColor: '#d394f9' },
    textColorDarkBlue: { lightModeColor: '#174e86', darkModeColor: '#93b8f9' },
    textColorDarkGreen: { lightModeColor: '#0f5c1a', darkModeColor: '#7fc57b' },
    textColorDarkYellow: { lightModeColor: '#c3971d', darkModeColor: '#946f00' },
    textColorDarkOrange: { lightModeColor: '#be5b17', darkModeColor: '#de7633' },
    textColorDarkRed: { lightModeColor: '#861106', darkModeColor: '#ff9b7c' },
    textColorDarkPurple: { lightModeColor: '#5e327c', darkModeColor: '#dea9fd' },
    textColorDarkerBlue: { lightModeColor: '#002451', darkModeColor: '#cedbff' },
    textColorDarkerGreen: { lightModeColor: '#06400c', darkModeColor: '#a3da9b' },
    textColorDarkerYellow: { lightModeColor: '#a37519', darkModeColor: '#b5852a' },
    textColorDarkerOrange: { lightModeColor: '#934511', darkModeColor: '#ef935c' },
    textColorDarkerRed: { lightModeColor: '#570606', darkModeColor: '#ffc0b1' },
    textColorDarkerPurple: { lightModeColor: '#3b204d', darkModeColor: '#eecaff' },
    textColorWhite: { lightModeColor: '#ffffff', darkModeColor: '#333333' },
    textColorLightGray: { lightModeColor: '#cccccc', darkModeColor: '#535353' },
    textColorGray: { lightModeColor: '#999999', darkModeColor: '#777777' },
    textColorDarkGray: { lightModeColor: '#666666', darkModeColor: '#a0a0a0' },
    textColorDarkerGray: { lightModeColor: '#333333', darkModeColor: '#cfcfcf' },
    textColorBlack: { lightModeColor: '#000000', darkModeColor: '#ffffff' },
};

/**
 * @internal
 */
const TextColorDropDownItems: Record<TextColorKeys, string> = {
    textColorLightBlue: 'Light blue',
    textColorLightGreen: 'Light green',
    textColorLightYellow: 'Light yellow',
    textColorLightOrange: 'Light orange',
    textColorLightRed: 'Light red',
    textColorLightPurple: 'Light purple',
    textColorBlue: 'Blue',
    textColorGreen: 'Green',
    textColorYellow: 'Yellow',
    textColorOrange: 'Orange',
    textColorRed: 'Red',
    textColorPurple: 'Purple',
    textColorDarkBlue: 'Dark blue',
    textColorDarkGreen: 'Dark green',
    textColorDarkYellow: 'Dark yellow',
    textColorDarkOrange: 'Dark orange',
    textColorDarkRed: 'Dark red',
    textColorDarkPurple: 'Dark purple',
    textColorDarkerBlue: 'Darker blue',
    textColorDarkerGreen: 'Darker green',
    textColorDarkerYellow: 'Darker yellow',
    textColorDarkerOrange: 'Darker orange',
    textColorDarkerRed: 'Darker red',
    textColorDarkerPurple: 'Darker purple',
    textColorWhite: 'White',
    textColorLightGray: 'Light gray',
    textColorGray: 'Gray',
    textColorDarkGray: 'Dark gray',
    textColorDarkerGray: 'Darker gray',
    textColorBlack: 'Black',
};

/**
 * Get mode independent color value of text color from the given color key
 * @param key The key to get color from
 * @returns A model independent color value of the given key
 */
function getTextColorValue(key: TextColorKeys): ModeIndependentColor {
    return TextColors[key];
}

export { TextColors, TextColorDropDownItems, getTextColorValue };
