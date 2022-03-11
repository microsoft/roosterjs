import RibbonButton from '../../type/RibbonButton';
import { BackgroundColors, getColorPickerDropDown } from './colorPicker';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    BackgroundColorKeys,
    BackgroundColorButtonStringKey,
} from '../../type/RibbonButtonStringKeys';

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
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton<BackgroundColorButtonStringKey> = {
    dropDownMenu: getColorPickerDropDown(BackgroundColorDropDownItems),
    key: 'buttonNameBackgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    onClick: (editor, key: BackgroundColorKeys) => {
        setBackgroundColor(editor, BackgroundColors[key]);
    },
};
