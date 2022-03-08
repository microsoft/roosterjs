import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { colorPicker, TextColorKeys, TextColors } from './colorPicker';
import { setTextColor } from 'roosterjs-editor-api';

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
 * Key of localized strings of Text color button
 */
export type TextColorButtonStringKey = 'buttonNameTextColor' | TextColorKeys;

/**
 * "Text color" button on the format ribbon
 */
export const textColor: RibbonButton<TextColorButtonStringKey> = {
    ...colorPicker,
    key: 'buttonNameTextColor',
    unlocalizedText: 'Text color',
    iconName: 'FontColor',
    dropDownItems: TextColorDropDownItems,
    onClick: (editor, key: TextColorKeys) => {
        setTextColor(editor, TextColors[key]);
    },
};
