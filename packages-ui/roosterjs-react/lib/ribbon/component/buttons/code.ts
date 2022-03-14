import RibbonButton from '../../type/RibbonButton';
import { CodeButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleCodeBlock } from 'roosterjs-editor-api';

/**
 * @internal
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
