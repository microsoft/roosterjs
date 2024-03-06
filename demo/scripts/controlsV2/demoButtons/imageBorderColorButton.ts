import { renderColorPicker } from '../roosterjsReact/colorPicker/component/renderColorPicker';
import { setImageBorder } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../roosterjsReact/ribbon';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../roosterjsReact/colorPicker/utils/getClassNamesForColorPicker';
import {
    getTextColorValue,
    TextColorDropDownItems,
    TextColors,
} from '../roosterjsReact/colorPicker/utils/textColors';

/**
 * @internal
 * "Image Border Color" button on the format ribbon
 */
export const imageBorderColorButton: RibbonButton<'buttonNameImageBorderColor'> = {
    dropDownMenu: {
        items: TextColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender: (item, onClick) => renderColorPicker(item, TextColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    },
    key: 'buttonNameImageBorderColor',
    unlocalizedText: 'Image Border Color',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameImageBorderColor') {
            setImageBorder(editor, { color: getTextColorValue(key).lightModeColor }, '5px');
        }
    },
};
