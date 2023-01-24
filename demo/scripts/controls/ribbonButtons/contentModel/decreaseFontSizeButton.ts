import isContentModelEditor from '../../editor/isContentModelEditor';
import { changeFontSize } from 'roosterjs-content-model';
import { DecreaseFontSizeButtonStringKey, RibbonButton } from 'roosterjs-react';

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
