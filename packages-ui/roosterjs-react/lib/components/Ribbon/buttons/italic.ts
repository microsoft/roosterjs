import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleItalic } from 'roosterjs-editor-api';

/**
 * "Italic" button on the format ribbon
 */
export const italic: RibbonButton = {
    key: 'italic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    checked: formatState => formatState.isItalic,
    onClick: editor => {
        toggleItalic(editor);
        return true;
    },
};
