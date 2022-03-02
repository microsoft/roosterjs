import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleUnderline } from 'roosterjs-editor-api';

/**
 * "Underline" button on the format ribbon
 */
export const underline: RibbonButton = {
    key: 'underline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    checked: formatState => formatState.isUnderline,
    onClick: editor => {
        toggleUnderline(editor);
        return true;
    },
};
