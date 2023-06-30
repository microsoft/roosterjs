import { AlignRightButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setAlignment } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Align right" button on the format ribbon
 */
export const alignRightButton: RibbonButton<AlignRightButtonStringKey> = {
    key: 'buttonNameAlignRight',
    unlocalizedText: 'Align right',
    iconName: 'AlignRight',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setAlignment(editor, 'right');
        }
        return true;
    },
};
