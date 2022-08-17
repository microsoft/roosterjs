import RibbonButton from '../../type/RibbonButton';
import { BackgroundColorButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { renderColorPicker } from '../../../colorPicker/component/renderColorPicker';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../../colorPicker/utils/getClassNamesForColorPicker';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
    getBackgroundColorValue,
} from '../../../colorPicker/utils/backgroundColors';

const Key: 'buttonNameBackgroundColor' = 'buttonNameBackgroundColor';

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton<BackgroundColorButtonStringKey> = {
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
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != Key) {
            setBackgroundColor(editor, getBackgroundColorValue(key));
        }
    },
};
