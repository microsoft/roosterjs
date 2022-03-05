import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';

/**
 * "Decrease font size" button on the format ribbon
 */
export const decreaseFontSize: RibbonButton = {
    key: 'decreaseFontSize',
    unlocalizedText: 'Decrease font size',
    iconName: 'FontDecrease',
    onClick: editor => {
        changeFontSize(editor, FontSizeChange.Decrease);
    },
};
