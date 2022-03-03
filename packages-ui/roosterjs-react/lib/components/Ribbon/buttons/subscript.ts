import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleSubscript } from 'roosterjs-editor-api';

/**
 * "Subscript" button on the format ribbon
 */
export const subscript: RibbonButton = {
    key: 'subscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    checked: formatState => formatState.isSubscript,
    onClick: editor => {
        toggleSubscript(editor);
        return true;
    },
};
