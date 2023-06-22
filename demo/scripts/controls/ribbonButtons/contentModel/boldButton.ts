import { BoldButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, toggleBold } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const boldButton: RibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    isChecked: formatState => formatState.isBold,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleBold(editor);
        }
        return true;
    },
};
