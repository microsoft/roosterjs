import { AlignCenterButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setAlignment } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Align center" button on the format ribbon
 */
export const alignCenterButton: RibbonButton<AlignCenterButtonStringKey> = {
    key: 'buttonNameAlignCenter',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setAlignment(editor, 'center');
        }
        return true;
    },
};
