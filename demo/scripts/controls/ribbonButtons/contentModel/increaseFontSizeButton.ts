import ContentModelRibbonButton from './ContentModelRibbonButton';
import { changeFontSize } from 'roosterjs-content-model-api';
import { IncreaseFontSizeButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSizeButton: ContentModelRibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        changeFontSize(editor, 'increase');
    },
};
