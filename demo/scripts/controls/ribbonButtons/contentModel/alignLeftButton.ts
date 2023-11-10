import { AlignLeftButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { setAlignment } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Align left" button on the format ribbon
 */
export const alignLeftButton: RibbonButton<AlignLeftButtonStringKey> = {
    key: 'buttonNameAlignLeft',
    unlocalizedText: 'Align left',
    iconName: 'AlignLeft',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setAlignment(editor, 'left');
        }
        return true;
    },
};
