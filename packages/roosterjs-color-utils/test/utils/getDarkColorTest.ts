import * as Color from 'color';
import getDarkColor from '../../lib/utils/getDarkColor';

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
    '#0076c2',
    '#217a00',
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
    '#005500',
    '#343c00',
    '#77490b',
    '#bc454a',
    '#aa2bad',
    '#333333',
    '#535353',
    '#777777',
    '#a0a0a0',
    '#cfcfcf',
    '#ffffff',
];

describe('getDarkColor', () => {
    it('textColors', () => {
        lightModeTextColors.forEach((color, i) => {
            const darkColor = getDarkColor(color);
            const expectedColor = Color(darkModeTextColors[i]).rgb().toString();

            expect(darkColor).toBe(expectedColor, color + ' ' + darkModeTextColors[i]);
        });
    });

    it('backgroundColors', () => {
        lightModeBackColors.forEach((color, i) => {
            const darkColor = getDarkColor(color);
            const expectedColor = Color(darkModeBackColors[i]).rgb().toString();

            expect(darkColor).toBe(expectedColor, color + ' ' + darkModeBackColors[i]);
        });
    });
});
