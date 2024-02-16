import { changeFontSize } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { DecreaseFontSizeButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Decrease font size" button on the format ribbon
 */
export const decreaseFontSizeButton: RibbonButton<DecreaseFontSizeButtonStringKey> = {
    key: 'buttonNameDecreaseFontSize',
    unlocalizedText: 'Decrease font size',
    iconName: 'FontDecrease',
    category: 'format',
    onClick: editor => {
        changeFontSize(editor, 'decrease');
    },
};
