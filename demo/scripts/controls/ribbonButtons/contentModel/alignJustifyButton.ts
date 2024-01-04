import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';
import { setAlignment } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Align justify" button on the format ribbon
 */
export const alignJustifyButton: RibbonButton<'buttonNameAlignJustify'> = {
    key: 'buttonNameAlignJustify',
    unlocalizedText: 'Align justify',
    iconName: 'AlignJustify',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setAlignment(editor, 'justify');
        }
        return true;
    },
};
