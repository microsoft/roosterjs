import RibbonButton from '../../type/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';

/**
 * Key of localized strings of Increase font size button
 */
export type IncreaseFontSizeButtonStringKey = 'buttonNameIncreaseFontSize';

/**
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSize: RibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        changeFontSize(editor, FontSizeChange.Increase);
    },
};
