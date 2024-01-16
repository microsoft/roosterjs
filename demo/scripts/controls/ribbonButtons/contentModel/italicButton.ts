import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleItalic } from 'roosterjs-content-model-api';
import { ItalicButtonStringKey } from 'roosterjs-react';

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
