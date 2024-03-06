import { toggleCode } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { CodeButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Code" button on the format ribbon
 */
export const codeButton: RibbonButton<CodeButtonStringKey> = {
    key: 'buttonNameCode',
    unlocalizedText: 'Code',
    iconName: 'Code',
    isChecked: formatState => !!formatState.isCodeInline,
    onClick: editor => {
        toggleCode(editor);
    },
};
