import {
    BackgroundColorKeys,
    getBackgroundColorValue,
    getColorPickerDropDown,
} from 'roosterjs-react';
import { setTableCellShade } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

export const setTableCellShadeButton: RibbonButton<
    'ribbonButtonSetTableCellShade' | BackgroundColorKeys
> = {
    dropDownMenu: getColorPickerDropDown('background'),
    key: 'ribbonButtonSetTableCellShade',
    unlocalizedText: 'Set table shade color',
    iconName: 'BackgroundColor',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        if (key != 'ribbonButtonSetTableCellShade') {
            const color = getBackgroundColorValue(key);

            // Content Model doesn't need dark mode color at this point, so always pass in light mode color
            setTableCellShade(editor, color.lightModeColor);
        }
    },
};
