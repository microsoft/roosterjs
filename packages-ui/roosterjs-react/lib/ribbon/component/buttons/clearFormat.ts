import RibbonButton from '../../type/RibbonButton';
import { clearFormat as clearFormatApi } from 'roosterjs-editor-api';
import { ClearFormatButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { ClearFormatMode } from 'roosterjs-editor-types';

/**
 * @internal
 * "Clear format" button on the format ribbon
 */
export const clearFormat: RibbonButton<ClearFormatButtonStringKey> = {
    key: 'buttonNameClearFormat',
    unlocalizedText: 'Clear format',
    iconName: 'ClearFormatting',
    onClick: editor => {
        clearFormatApi(editor, ClearFormatMode.AutoDetect);
    },
};
