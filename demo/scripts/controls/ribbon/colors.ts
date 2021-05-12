import { IEditor, ModeIndependentColor } from 'roosterjs-editor-types';
import { setBackgroundColor, setTextColor } from 'roosterjs-editor-api';

const lightModeTextColors = [
    '#51a7f9',
    '#6fc040',
    '#f5d427',
    '#f3901d',
    '#ed5c57',
    '#b36ae2',
    '#0c64c0',
    '#0c882a',
    '#dcbe22',
    '#de6a19',
    '#c82613',
    '#763e9b',
    '#174e86',
    '#0f5c1a',
    '#c3971d',
    '#be5b17',
    '#861106',
    '#5e327c',
    '#002451',
    '#06400c',
    '#a37519',
    '#934511',
    '#570606',
    '#3b204d',
    '#ffffff',
    '#cccccc',
    '#999999',
    '#666666',
    '#333333',
    '#000000',
];
const darkModeTextColors = [
    '#0075c2',
    '#207a00',
    '#5d4d00',
    '#ab5500',
    '#df504d',
    '#ab63da',
    '#6da0ff',
    '#3da848',
    '#6d5c00',
    '#d3610c',
    '#ff6847',
    '#d394f9',
    '#93b8f9',
    '#7fc57b',
    '#946f00',
    '#de7633',
    '#ff9b7c',
    '#dea9fd',
    '#cedbff',
    '#a3da9b',
    '#b5852a',
    '#ef935c',
    '#ffc0b1',
    '#eecaff',
    '#333333',
    '#535353',
    '#777777',
    '#a0a0a0',
    '#cfcfcf',
    '#ffffff',
];

const lightModeBackColors = [
    '#00ffff',
    '#00ff00',
    '#ffff00',
    '#ff8000',
    '#ff0000',
    '#ff00ff',
    '#80ffff',
    '#80ff80',
    '#ffff80',
    '#ffc080',
    '#ff8080',
    '#ff80ff',
    '#ffffff',
    '#cccccc',
    '#999999',
    '#666666',
    '#333333',
    '#000000',
];
const darkModeBackColors = [
    '#005357',
    '#005e00',
    '#383e00',
    '#bf4c00',
    '#ff2711',
    '#e700e8',
    '#004c4f',
    '#005400',
    '#343c00',
    '#77480b',
    '#bc454a',
    '#aa2bad',
    '#333333',
    '#535353',
    '#777777',
    '#a0a0a0',
    '#cfcfcf',
    '#ffffff',
];

export const textColorNames = {
    LightBlue: 'Light Blue',
    LightGreen: 'Light Green',
    LightYellow: 'Light Yellow',
    LightOrange: 'Light Orange',
    LightRed: 'Light Red',
    LightPurple: 'Light Purple',
    Blue: 'Blue',
    Green: 'Green',
    Yellow: 'Yellow',
    Orange: 'Orange',
    Red: 'Red',
    Purple: 'Purple',
    DarkBlue: 'Dark Blue',
    DarkGreen: 'Dark Green',
    DarkYellow: 'Dark Yellow',
    DarkOrange: 'Dark Orange',
    DarkRed: 'Dark Red',
    DarkPurple: 'Dark Purple',
    DarkerBlue: 'Darker Blue',
    DarkerGreen: 'Darker Green',
    DarkerYellow: 'Darker Yellow',
    DarkerOrange: 'Darker Orange',
    DarkerRed: 'Darker Red',
    DarkerPurple: 'Darker Purple',
    White: 'White',
    LightGray: 'Light Gray',
    Gray: 'Gray',
    DarkGray: 'Dark Gray',
    DarkerGray: 'Darker Gray',
    Black: 'Black',
};

export const backColorNames = {
    Cyan: 'Cyan',
    Green: 'Green',
    Yellow: 'Yellow',
    Orange: 'Orange',
    Red: 'Red',
    Magenta: 'Magenta',
    LightCyan: 'Light Cyan',
    LightGreen: 'Light Green',
    LightYellow: 'Light Yellow',
    LightOrange: 'Light Orange',
    LightRed: 'Light Red',
    LightMagenta: 'Light Magenta',
    White: 'White',
    LightGray: 'Light Gray',
    Gray: 'Gray',
    DarkGray: 'Dark Gray',
    DarkerGray: 'Darker Gray',
    Black: 'Black',
};

interface Color {
    name: string;
    color: ModeIndependentColor;
}

const textColors: Color[] = Object.keys(textColorNames).map((name, index) => ({
    name: name,
    color: {
        lightModeColor: lightModeTextColors[index],
        darkModeColor: darkModeTextColors[index],
    },
}));

const backColors: Color[] = Object.keys(backColorNames).map((name, index) => ({
    name: name,
    color: {
        lightModeColor: lightModeBackColors[index],
        darkModeColor: darkModeBackColors[index],
    },
}));

export function setTextColorFromRibbon(editor: IEditor, colorName: string) {
    const color = textColors.filter(color => color.name == colorName)[0];

    if (color) {
        setTextColor(editor, color.color);
    }
}

export function setBackColorFromRibbon(editor: IEditor, colorName: string) {
    const color = backColors.filter(color => color.name == colorName)[0];

    if (color) {
        setBackgroundColor(editor, color.color);
    }
}
