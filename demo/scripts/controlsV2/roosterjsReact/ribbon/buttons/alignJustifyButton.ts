import { setAlignment } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Align justify" button on the format ribbon
 */
export const alignJustifyButton: RibbonButton<'buttonNameAlignJustify'> = {
    key: 'buttonNameAlignJustify',
    unlocalizedText: 'Align justify',
    iconName: 'AlignJustify',
    onClick: editor => {
        setAlignment(editor, 'justify');
    },
};
