import { setAlignment } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { AlignRightButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Align right" button on the format ribbon
 */
export const alignRightButton: RibbonButton<AlignRightButtonStringKey> = {
    key: 'buttonNameAlignRight',
    unlocalizedText: 'Align right',
    iconName: 'AlignRight',
    onClick: editor => {
        setAlignment(editor, 'right');
    },
};
