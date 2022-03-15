import RibbonButton from '../../type/RibbonButton';
import { applyCellShading } from 'roosterjs-editor-api';
import { BackgroundColorKeys, CellShadeButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { FormatState, ModeIndependentColor } from 'roosterjs-editor-types';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
    getColorPickerDropDown,
} from './colorPicker';

const defaultFontColor: ModeIndependentColor = {
    lightModeColor: 'rgb(51,51,51)',
    darkModeColor: '#FFFFFF',
};

/**
 * @internal
 * "Cell Shade" button on the format ribbon
 */
export const cellShade: RibbonButton<CellShadeButtonStringKey> = {
    key: 'buttonNameCellShade',
    unlocalizedText: 'CellShade',
    iconName: 'Color',
    dropDownMenu: getColorPickerDropDown(BackgroundColorDropDownItems),
    onClick: (editor, key: BackgroundColorKeys) => {
        applyCellShading(editor, BackgroundColors[key], defaultFontColor);
    },
    isDisabled: (format: FormatState) => {
        if (format.isInTable) {
            return false;
        }
        return true;
    },
};
