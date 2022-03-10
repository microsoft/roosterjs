import * as React from 'react';
import RibbonButtonDropDown from '../../type/RibbonButtonDropDown';
import { BackgroundColorKeys, TextColorKeys } from '../../type/RibbonButtonStringKeys';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ModeIndependentColor } from 'roosterjs-editor-types';

const classNames = mergeStyleSets({
    colorPickerContainer: {
        width: '192px',
        padding: '8px',
        background: 'white',
        overflow: 'hidden',
        '& ul': {
            width: '192px',
            overflow: 'hidden',
        },
    },
    colorMenuItem: {
        display: 'inline-block',
        width: '32px',
        height: '32px',
        background: 'white',
        '& button': {
            padding: '0px',
            minWidth: '0px',
            background: 'transparent',
            border: 'none',
        },
    },
    colorSquare: {
        width: '20px',
        height: '20px',
        margin: '4px',
        borderStyle: 'solid',
        borderWidth: '2px',
        '&:hover': {
            borderColor: 'red',
        },
    },
    colorSquareBorder: {
        borderColor: 'transparent',
    },
    colorSquareBorderWhite: {
        borderColor: '#bebebe',
    },
});

/**
 * @internal
 */
const TextColors: { [key in TextColorKeys]: ModeIndependentColor } = {
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
const BackgroundColors: { [key in BackgroundColorKeys]: ModeIndependentColor } = {
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
 */
type AllColorKeys = TextColorKeys | BackgroundColorKeys;

const AllColors: { [key in AllColorKeys]: ModeIndependentColor } = {
    ...TextColors,
    ...BackgroundColors,
};

/**
 * @internal
 * Common part of a color picker button
 */
function getColorPickerDropDown(items: Record<string, string>): RibbonButtonDropDown {
    return {
        items,
        itemClassName: classNames.colorMenuItem,
        allowLivePreview: true,
        itemRender: (item, onClick) => {
            const key = item.key as AllColorKeys;
            const buttonColor = AllColors[key].lightModeColor;
            return (
                <button onClick={e => onClick(e, item)} title={item.text}>
                    <div
                        className={
                            classNames.colorSquare +
                            ' ' +
                            (key == 'textColorWhite' || key == 'backgroundColorWhite'
                                ? classNames.colorSquareBorderWhite
                                : classNames.colorSquareBorder)
                        }
                        style={{
                            backgroundColor: buttonColor,
                        }}></div>
                </button>
            );
        },
        commandBarSubMenuProperties: {
            className: classNames.colorPickerContainer,
        },
    };
}

export { TextColors, BackgroundColors, getColorPickerDropDown };
