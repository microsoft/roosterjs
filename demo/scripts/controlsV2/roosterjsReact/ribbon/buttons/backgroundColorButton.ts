import { renderColorPicker } from '../../colorPicker/component/renderColorPicker';
import { setBackgroundColor } from 'roosterjs-content-model-api';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
    getBackgroundColorValue,
} from '../../colorPicker/utils/backgroundColors';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../colorPicker/utils/getClassNamesForColorPicker';
import type { RibbonButton } from '../type/RibbonButton';
import type { BackgroundColorButtonStringKey } from '../type/RibbonButtonStringKeys';

const Key: 'buttonNameBackgroundColor' = 'buttonNameBackgroundColor';

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColorButton: RibbonButton<BackgroundColorButtonStringKey> = {
    dropDownMenu: {
        items: BackgroundColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender: (item, onClick) => renderColorPicker(item, BackgroundColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    },
    key: Key,
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    category: 'format',
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameBackgroundColor') {
            setBackgroundColor(editor, getBackgroundColorValue(key).lightModeColor);
        }
    },
};
