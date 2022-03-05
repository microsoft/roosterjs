import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';

/**
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSize: RibbonButton = {
    key: 'increaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        changeFontSize(editor, FontSizeChange.Increase);
    },
};
