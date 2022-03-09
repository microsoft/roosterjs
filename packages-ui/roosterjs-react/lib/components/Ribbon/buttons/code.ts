import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleCodeBlock } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Code button
 */
export type CodeButtonStringKey = 'buttonNameCode';

/**
 * "Code" button on the format ribbon
 */
export const code: RibbonButton<CodeButtonStringKey> = {
    key: 'buttonNameCode',
    unlocalizedText: 'Code',
    iconName: 'Code',
    onClick: editor => {
        toggleCodeBlock(editor);
    },
};
