import { setAlignment } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { AlignLeftButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Align left" button on the format ribbon
 */
export const alignLeftButton: RibbonButton<AlignLeftButtonStringKey> = {
    key: 'buttonNameAlignLeft',
    unlocalizedText: 'Align left',
    iconName: 'AlignLeft',
    onClick: editor => {
        setAlignment(editor, 'left');
    },
};
