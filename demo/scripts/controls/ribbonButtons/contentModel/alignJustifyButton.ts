import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setAlignment } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Align justify" button on the format ribbon
 */
export const alignJustifyButton: ContentModelRibbonButton<'buttonNameAlignJustify'> = {
    key: 'buttonNameAlignJustify',
    unlocalizedText: 'Align justify',
    iconName: 'AlignJustify',
    onClick: editor => {
        setAlignment(editor, 'justify');
        return true;
    },
};
