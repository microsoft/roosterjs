import { clearFormat, isContentModelEditor } from 'roosterjs-content-model-editor';
import { ClearFormatButtonStringKey, RibbonButton } from 'roosterjs-react';

/**
 * "Clear format" button on the format ribbon
 */
export const clearFormatButton: RibbonButton<ClearFormatButtonStringKey> = {
    key: 'buttonNameClearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            clearFormat(editor);
        }
    },
};
