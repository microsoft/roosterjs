import { AlignLeftButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setAlignment } from 'roosterjs-content-model-editor';

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
