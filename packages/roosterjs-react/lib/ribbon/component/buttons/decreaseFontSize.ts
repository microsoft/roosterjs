import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';
import type RibbonButton from '../../type/RibbonButton';
import type { DecreaseFontSizeButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
