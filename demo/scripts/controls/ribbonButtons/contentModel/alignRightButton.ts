import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setAlignment } from 'roosterjs-content-model-editor';
import { AlignRightButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Align right" button on the format ribbon
 */
export const alignRightButton: ContentModelRibbonButton<AlignRightButtonStringKey> = {
    key: 'buttonNameAlignRight',
    unlocalizedText: 'Align right',
    iconName: 'AlignRight',
    onClick: editor => {
        setAlignment(editor, 'right');
        return true;
    },
};
