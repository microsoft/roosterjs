import RibbonButton from '../../type/RibbonButton';
import { BackgroundColorButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { ModeIndependentColor } from 'roosterjs-editor-types';
import { renderColorPicker } from '../../../colorPicker/component/renderColorPicker';
import { setBackgroundColor } from 'roosterjs-editor-api';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../../colorPicker/utils/getClassNamesForColorPicker';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
} from '../../../colorPicker/utils/backgroundColors';

const ColorValues = {
    ...BackgroundColors,
    // Add this value just to satisfy compiler
    buttonNameBackgroundColor: <ModeIndependentColor>null,
};

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
    key: 'buttonNameBackgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    onClick: (editor, key) => {
        setBackgroundColor(editor, ColorValues[key]);
    },
};
