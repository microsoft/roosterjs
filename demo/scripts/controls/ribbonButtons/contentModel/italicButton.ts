import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { ItalicButtonStringKey, RibbonButton } from 'roosterjs-react';
import { toggleItalic } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Italic" button on the format ribbon
 */
export const italicButton: RibbonButton<ItalicButtonStringKey> = {
    key: 'buttonNameItalic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    isChecked: formatState => formatState.isItalic,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleItalic(editor);
        }
        return true;
    },
};
