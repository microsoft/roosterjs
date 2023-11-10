import { CodeButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { toggleCode } from 'roosterjs-content-model-api';

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
        if (isContentModelEditor(editor)) {
            toggleCode(editor);
        }
    },
};
