import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleBold } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Bold button
 */
export type BoldButtonStringKey = 'buttonNameBold';

/**
 * "Bold" button on the format ribbon
 */
export const bold: RibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    checked: formatState => formatState.isBold,
    onClick: editor => {
        toggleBold(editor);
        return true;
    },
};
