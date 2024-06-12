import { toggleBold } from 'roosterjs-content-model-api';
import type { BoldButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * "Bold" button on the format ribbon
 */
export const boldButton: RibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    isChecked: formatState => !!formatState.isBold,
    onClick: editor => {
        toggleBold(editor);
    },
};
