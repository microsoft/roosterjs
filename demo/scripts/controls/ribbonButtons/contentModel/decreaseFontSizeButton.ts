import { changeFontSize } from 'roosterjs-content-model-api';
import { DecreaseFontSizeButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Decrease font size" button on the format ribbon
 */
export const decreaseFontSizeButton: RibbonButton<DecreaseFontSizeButtonStringKey> = {
    key: 'buttonNameDecreaseFontSize',
    unlocalizedText: 'Decrease font size',
    iconName: 'FontDecrease',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            changeFontSize(editor, 'decrease');
        }
    },
};
