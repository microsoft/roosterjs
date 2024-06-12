import { changeFontSize } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { IncreaseFontSizeButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSizeButton: RibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        changeFontSize(editor, 'increase');
    },
};
