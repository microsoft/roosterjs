import RibbonButton from '../../type/RibbonButton';
import { ModeIndependentColor } from 'roosterjs-editor-types';
import { renderColorPicker } from '../../../colorPicker/component/renderColorPicker';
import { setTextColor } from 'roosterjs-editor-api';
import { TextColorButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { TextColorDropDownItems, TextColors } from '../../../colorPicker/utils/textColors';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../../colorPicker/utils/getClassNamesForColorPicker';

const ColorValues = {
    ...TextColors,
    // Add this value just to satisfy compiler
    buttonNameTextColor: <ModeIndependentColor>null,
};
/**
 * @internal
 * "Text color" button on the format ribbon
 */
export const textColor: RibbonButton<TextColorButtonStringKey> = {
    dropDownMenu: {
        items: TextColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender: (item, onClick) => renderColorPicker(item, TextColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    },
    key: 'buttonNameTextColor',
    unlocalizedText: 'Text color',
    iconName: 'FontColor',
    onClick: (editor, key) => {
        setTextColor(editor, ColorValues[key]);
    },
};
