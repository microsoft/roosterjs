import RibbonButton from '../../type/RibbonButton';
import { BackgroundColorButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { IEditor } from 'roosterjs-editor-types';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    BackgroundColors,
    BackgroundColorDropDownItems,
    getColorPickerDropDown,
} from './colorPicker';

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton<BackgroundColorButtonStringKey> = {
    dropDownMenu: getColorPickerDropDown(BackgroundColorDropDownItems),
    key: 'buttonNameBackgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    onClick: (editor: IEditor, key) => {
        setBackgroundColor(editor, BackgroundColors[key]);
    },
};
