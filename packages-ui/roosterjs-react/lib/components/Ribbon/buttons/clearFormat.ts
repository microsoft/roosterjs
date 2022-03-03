import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { clearFormat as clearFormatApi } from 'roosterjs-editor-api';

/**
 * "Clear format" button on the format ribbon
 */
export const clearFormat: RibbonButton = {
    key: 'clearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        clearFormatApi(editor);
    },
};
