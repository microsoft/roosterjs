import ContentModelRibbonButton from './ContentModelRibbonButton';
import { ItalicButtonStringKey } from 'roosterjs-react';
import { toggleItalic } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Italic" button on the format ribbon
 */
export const italicButton: ContentModelRibbonButton<ItalicButtonStringKey> = {
    key: 'buttonNameItalic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    isChecked: formatState => formatState.isItalic,
    onClick: editor => {
        toggleItalic(editor);
        return true;
    },
};
