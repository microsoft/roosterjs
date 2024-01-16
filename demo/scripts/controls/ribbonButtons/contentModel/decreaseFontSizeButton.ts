import ContentModelRibbonButton from './ContentModelRibbonButton';
import { changeFontSize } from 'roosterjs-content-model-api';
import { DecreaseFontSizeButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Decrease font size" button on the format ribbon
 */
export const decreaseFontSizeButton: ContentModelRibbonButton<DecreaseFontSizeButtonStringKey> = {
    key: 'buttonNameDecreaseFontSize',
    unlocalizedText: 'Decrease font size',
    iconName: 'FontDecrease',
    onClick: editor => {
        changeFontSize(editor, 'decrease');
    },
};
