import { getColorPickerDropDown, getTextColorValue } from 'roosterjs-react';
import { setImageBorder } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Image Border Color" button on the format ribbon
 */
export const imageBorderColorButton: RibbonButton<'buttonNameImageBorderColor'> = {
    dropDownMenu: getColorPickerDropDown('text'),
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
