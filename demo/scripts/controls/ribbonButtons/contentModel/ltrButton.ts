import { LtrButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setDirection } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Left to right" button on the format ribbon
 */
export const ltrButton: RibbonButton<LtrButtonStringKey> = {
    key: 'buttonNameLtr',
    unlocalizedText: 'Left to right',
    iconName: 'BidiLtr',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setDirection(editor, 'ltr');
        }

        return true;
    },
};
