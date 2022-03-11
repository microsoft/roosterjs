import RibbonButton from '../../type/RibbonButton';
import { BackgroundColorKeys, BackgroundColors, colorPicker } from './colorPicker';
import { setBackgroundColor } from 'roosterjs-editor-api';

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
 * Key of localized strings of Background color button
 */
export type BackgroundColorButtonStringKey = 'buttonNameBackgroundColor';

/**
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton<BackgroundColorButtonStringKey> = {
    ...colorPicker,
    key: 'buttonNameBackgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    dropDownItems: BackgroundColorDropDownItems,
    onClick: (editor, key: BackgroundColorKeys) => {
        setBackgroundColor(editor, BackgroundColors[key]);
    },
};
