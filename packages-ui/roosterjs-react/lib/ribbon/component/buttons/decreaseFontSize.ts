import RibbonButton from '../../type/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { DecreaseFontSizeButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { FontSizeChange } from 'roosterjs-editor-types';

/**
 * @internal
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
