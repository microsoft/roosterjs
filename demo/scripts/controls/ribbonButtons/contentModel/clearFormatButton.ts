import ContentModelRibbonButton from './ContentModelRibbonButton';
import { clearFormat } from 'roosterjs-content-model-api';
import { ClearFormatButtonStringKey } from 'roosterjs-react';

/**
 * "Clear format" button on the format ribbon
 */
export const clearFormatButton: ContentModelRibbonButton<ClearFormatButtonStringKey> = {
    key: 'buttonNameClearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        clearFormat(editor);
    },
};
