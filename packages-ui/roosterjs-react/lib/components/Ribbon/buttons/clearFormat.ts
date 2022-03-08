import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { clearFormat as clearFormatApi } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Clear format button
 */
export type ClearFormatButtonStringKey = 'buttonNameClearFormat';

/**
 * "Clear format" button on the format ribbon
 */
export const clearFormat: RibbonButton<ClearFormatButtonStringKey> = {
    key: 'buttonNameClearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        clearFormatApi(editor);
    },
};
