import { MainPaneBase } from '../mainPane/MainPaneBase';
import { renderColorPicker } from '../roosterjsReact/colorPicker/component/renderColorPicker';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../roosterjsReact/colorPicker/utils/getClassNamesForColorPicker';
import {
    getTextColorValue,
    TextColorDropDownItems,
    TextColors,
} from '../roosterjsReact/colorPicker/utils/textColors';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * @internal
 * "Table Border Color" button on the format ribbon
 */
export const tableBorderColorButton: RibbonButton<'buttonNameTableBorderColor'> = {
    dropDownMenu: {
        items: TextColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender: (item, onClick) => renderColorPicker(item, TextColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    },
    key: 'buttonNameTableBorderColor',
    unlocalizedText: 'Table Border Color',
    iconName: 'ColorSolid',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTableBorderColor') {
            MainPaneBase.getInstance().setTableBorderColor(getTextColorValue(key).lightModeColor);
            editor.focus();
        }
    },
};
