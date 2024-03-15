import { toggleBold } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { BoldButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const bold: RibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    isChecked: formatState => !!formatState.isBold,
    onClick: editor => {
        toggleBold(editor);
        return true;
    },
};
