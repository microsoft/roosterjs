import { changeFontSize } from 'roosterjs-content-model-api';
import { IncreaseFontSizeButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSizeButton: RibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            changeFontSize(editor, 'increase');
        }
    },
};
