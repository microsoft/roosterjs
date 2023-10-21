import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleCode } from 'roosterjs-content-model-editor';
import { CodeButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Code" button on the format ribbon
 */
export const codeButton: ContentModelRibbonButton<CodeButtonStringKey> = {
    key: 'buttonNameCode',
    unlocalizedText: 'Code',
    iconName: 'Code',
    isChecked: formatState => !!formatState.isCodeInline,
    onClick: editor => {
        toggleCode(editor);
    },
};
