import { setAlignment } from 'roosterjs-content-model-api';
import type { AlignCenterButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * "Align center" button on the format ribbon
 */
export const alignCenterButton: RibbonButton<AlignCenterButtonStringKey> = {
    key: 'buttonNameAlignCenter',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        setAlignment(editor, 'center');
    },
};
