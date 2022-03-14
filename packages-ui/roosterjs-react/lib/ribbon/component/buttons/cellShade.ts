import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { applyCellShading } from 'roosterjs-editor-api';
import {
    BackgroundColorKeys,
    BackgroundColors,
    colorPicker,
    BackgroundColorDropDownItems,
} from './colorPicker';

/**
 * Key of localized strings of Cell Shade button
 */
export type CellShadeButtonStringKey = 'buttonNameCellShade';

/**
 * "Cell Shade" button on the format ribbon
 */
export const cellShade: RibbonButton<CellShadeButtonStringKey> = {
    ...colorPicker,
    key: 'buttonNameCellShade',
    unlocalizedText: 'CellShade',
    iconName: 'Color',
    dropDownItems: BackgroundColorDropDownItems,
    onClick: (editor, key: BackgroundColorKeys) => {
        applyCellShading(editor, BackgroundColors[key]);
    },
};
