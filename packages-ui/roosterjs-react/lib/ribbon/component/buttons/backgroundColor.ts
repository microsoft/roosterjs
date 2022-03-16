import RibbonButton from '../../type/RibbonButton';
import { IEditor } from 'roosterjs-editor-types';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    BackgroundColors,
    BackgroundColorDropDownItems,
    getColorPickerDropDown,
} from './colorPicker';

import {
    BackgroundColorKeys,
    BackgroundColorButtonStringKey,
} from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton<BackgroundColorButtonStringKey> = {
    dropDownMenu: getColorPickerDropDown(BackgroundColorDropDownItems),
    key: 'buttonNameBackgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    onClick: (editor: IEditor, key: BackgroundColorKeys) => {
        setBackgroundColor(editor, BackgroundColors[key]);
    },
};
