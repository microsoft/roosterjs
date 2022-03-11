import RibbonButton from '../../type/RibbonButton';
import { getColorPickerDropDown, TextColors } from './colorPicker';
import { setTextColor } from 'roosterjs-editor-api';
import { TextColorButtonStringKey, TextColorKeys } from '../../type/RibbonButtonStringKeys';

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
 * @internal
 * "Text color" button on the format ribbon
 */
export const textColor: RibbonButton<TextColorButtonStringKey> = {
    dropDownMenu: getColorPickerDropDown(TextColorDropDownItems),
    key: 'buttonNameTextColor',
    unlocalizedText: 'Text color',
    iconName: 'FontColor',
    onClick: (editor, key: TextColorKeys) => {
        setTextColor(editor, TextColors[key]);
    },
};
