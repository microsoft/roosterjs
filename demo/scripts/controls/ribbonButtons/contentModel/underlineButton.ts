import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleUnderline } from 'roosterjs-content-model-editor';
import { UnderlineButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Underline" button on the format ribbon
 */
export const underlineButton: ContentModelRibbonButton<UnderlineButtonStringKey> = {
    key: 'buttonNameUnderline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    isChecked: formatState => formatState.isUnderline,
    onClick: editor => {
        toggleUnderline(editor);
        return true;
    },
};
