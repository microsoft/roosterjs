import RibbonButton from '../../type/RibbonButton';
import { renderColorPicker } from '../../../colorPicker/component/renderColorPicker';
import { setTextColor } from 'roosterjs-editor-api';
import { TextColorButtonStringKey } from '../../type/RibbonButtonStringKeys';
import {
    getTextColorValue,
    TextColorDropDownItems,
    TextColors,
} from '../../../colorPicker/utils/textColors';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../../colorPicker/utils/getClassNamesForColorPicker';

const Key: 'buttonNameTextColor' = 'buttonNameTextColor';

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
    key: Key,
    unlocalizedText: 'Text color',
    iconName: 'FontColor',
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != Key) {
            setTextColor(editor, getTextColorValue(key));
        }
    },
};
