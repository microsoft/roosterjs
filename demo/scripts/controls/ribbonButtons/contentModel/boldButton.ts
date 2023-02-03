import { BoldButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';
import { toggleBold } from 'roosterjs-content-model';

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
