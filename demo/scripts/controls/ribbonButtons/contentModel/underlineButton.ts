import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton, UnderlineButtonStringKey } from 'roosterjs-react';
import { toggleUnderline } from 'roosterjs-content-model';

/**
 * @internal
 * "Underline" button on the format ribbon
 */
export const underlineButton: RibbonButton<UnderlineButtonStringKey> = {
    key: 'buttonNameUnderline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    isChecked: formatState => formatState.isUnderline,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleUnderline(editor);
        }
        return true;
    },
};
