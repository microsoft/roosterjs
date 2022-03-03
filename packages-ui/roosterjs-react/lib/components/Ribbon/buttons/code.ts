import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleCodeBlock } from 'roosterjs-editor-api';

/**
 * "Code" button on the format ribbon
 */
export const code: RibbonButton = {
    key: 'code',
    unlocalizedText: 'Code',
    iconName: 'Code',
    onClick: editor => {
        toggleCodeBlock(editor);
    },
};
