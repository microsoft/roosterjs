import { clearFormat } from 'roosterjs-content-model-api';
import type { ClearFormatButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * "Clear format" button on the format ribbon
 */
export const clearFormatButton: RibbonButton<ClearFormatButtonStringKey> = {
    key: 'buttonNameClearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        clearFormat(editor);
    },
};
