import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleStrikethrough } from 'roosterjs-editor-api';

/**
 * "Strikethrough" button on the format ribbon
 */
export const strikethrough: RibbonButton = {
    key: 'strikethrough',
    unlocalizedText: 'Strikethrough',
    iconName: 'Strikethrough',
    checked: formatState => formatState.isStrikeThrough,
    onClick: editor => {
        toggleStrikethrough(editor);
        return true;
    },
};
