import { BackgroundColorKeys } from '../roosterjsReact/colorPicker/types/stringKeys';
import { renderColorPicker } from '../roosterjsReact/colorPicker/component/renderColorPicker';
import { setTableCellShade } from 'roosterjs-content-model-api';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../roosterjsReact/colorPicker/utils/getClassNamesForColorPicker';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
    getBackgroundColorValue,
} from '../roosterjsReact/colorPicker/utils/backgroundColors';
import type { RibbonButton } from '../roosterjsReact/ribbon';

export const setTableCellShadeButton: RibbonButton<
    'ribbonButtonSetTableCellShade' | BackgroundColorKeys
> = {
    dropDownMenu: {
        items: BackgroundColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender: (item, onClick) => renderColorPicker(item, BackgroundColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    },
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
