import { CodeButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, toggleCode } from 'roosterjs-content-model';

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
