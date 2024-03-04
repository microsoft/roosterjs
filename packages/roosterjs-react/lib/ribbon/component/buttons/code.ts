import { toggleCodeBlock } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { CodeButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Code" button on the format ribbon
 */
export const code: RibbonButton<CodeButtonStringKey> = {
    key: 'buttonNameCode',
    unlocalizedText: 'Code',
    iconName: 'Code',
    isChecked: formatState => !!formatState.isCodeBlock,
    onClick: editor => {
        toggleCodeBlock(editor);
    },
};
