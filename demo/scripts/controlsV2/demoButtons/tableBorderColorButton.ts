import { getColorPickerDropDown, getTextColorValue } from 'roosterjs-react';
import { MainPane } from '../mainPane/MainPane';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Table Border Color" button on the format ribbon
 */
export const tableBorderColorButton: RibbonButton<'buttonNameTableBorderColor'> = {
    dropDownMenu: getColorPickerDropDown('text'),
    key: 'buttonNameTableBorderColor',
    unlocalizedText: 'Table Border Color',
    iconName: 'ColorSolid',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTableBorderColor') {
            MainPane.getInstance().setTableBorderColor(getTextColorValue(key).lightModeColor);
            editor.focus();
        }
    },
};
