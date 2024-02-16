import { toggleBold } from 'roosterjs-content-model-api';
import type { BoldButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const boldButton: RibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    isChecked: formatState => formatState.isBold,
    category: 'format',
    onClick: editor => {
        toggleBold(editor);
    },
};
