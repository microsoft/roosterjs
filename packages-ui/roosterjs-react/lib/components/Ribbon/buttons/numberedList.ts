import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleNumbering } from 'roosterjs-editor-api';

/**
 * "Numbered list" button on the format ribbon
 */
export const numberedList: RibbonButton = {
    key: 'numberedList',
    unlocalizedText: 'Numbered list',
    iconName: 'NumberedList',
    checked: formatState => formatState.isNumbering,
    onClick: editor => {
        toggleNumbering(editor);
        return true;
    },
};
