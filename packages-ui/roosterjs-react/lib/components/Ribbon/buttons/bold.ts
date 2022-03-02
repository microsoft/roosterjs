import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleBold } from 'roosterjs-editor-api';

/**
 * "Bold" button on the format ribbon
 */
export const bold: RibbonButton = {
    key: 'bold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    checked: formatState => formatState.isBold,
    onClick: editor => {
        toggleBold(editor);
        return true;
    },
};
