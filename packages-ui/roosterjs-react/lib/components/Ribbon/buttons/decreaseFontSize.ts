import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';

/**
 * Key of localized strings of Decrease font size button
 */
export type DecreaseFontSizeButtonStringKey = 'buttonNameDecreaseFontSize';

/**
 * "Decrease font size" button on the format ribbon
 */
export const decreaseFontSize: RibbonButton<DecreaseFontSizeButtonStringKey> = {
    key: 'buttonNameDecreaseFontSize',
    unlocalizedText: 'Decrease font size',
    iconName: 'FontDecrease',
    onClick: editor => {
        changeFontSize(editor, FontSizeChange.Decrease);
    },
};
