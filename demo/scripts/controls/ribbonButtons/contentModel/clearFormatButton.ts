import { clearFormat } from 'roosterjs-content-model';
import { ClearFormatButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';

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
