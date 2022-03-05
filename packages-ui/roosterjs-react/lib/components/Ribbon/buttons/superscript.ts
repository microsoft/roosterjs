import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleSuperscript } from 'roosterjs-editor-api';

/**
 * "Superscript" button on the format ribbon
 */
export const superscript: RibbonButton = {
    key: 'superscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    checked: formatState => formatState.isSuperscript,
    onClick: editor => {
        toggleSuperscript(editor);
        return true;
    },
};
