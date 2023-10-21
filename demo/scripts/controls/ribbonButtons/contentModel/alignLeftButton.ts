import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setAlignment } from 'roosterjs-content-model-editor';
import { AlignLeftButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Align left" button on the format ribbon
 */
export const alignLeftButton: ContentModelRibbonButton<AlignLeftButtonStringKey> = {
    key: 'buttonNameAlignLeft',
    unlocalizedText: 'Align left',
    iconName: 'AlignLeft',
    onClick: editor => {
        setAlignment(editor, 'left');
        return true;
    },
};
