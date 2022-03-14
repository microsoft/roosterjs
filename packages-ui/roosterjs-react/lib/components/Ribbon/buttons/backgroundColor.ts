import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    BackgroundColorKeys,
    BackgroundColors,
    colorPicker,
    BackgroundColorDropDownItems,
} from './colorPicker';

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
