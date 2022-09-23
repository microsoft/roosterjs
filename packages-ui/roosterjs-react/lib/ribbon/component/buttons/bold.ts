import RibbonButton from '../../type/RibbonButton';
import { BoldButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleBold } from 'roosterjs-editor-api';

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
