import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setAlignment } from 'roosterjs-content-model-editor';
import { AlignCenterButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Align center" button on the format ribbon
 */
export const alignCenterButton: ContentModelRibbonButton<AlignCenterButtonStringKey> = {
    key: 'buttonNameAlignCenter',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        setAlignment(editor, 'center');
        return true;
    },
};
