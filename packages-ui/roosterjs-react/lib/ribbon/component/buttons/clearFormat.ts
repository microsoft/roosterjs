import { clearFormat as clearFormatApi } from 'roosterjs-editor-api';
import { ClearFormatMode } from 'roosterjs-editor-types';
import type RibbonButton from '../../type/RibbonButton';
import type { ClearFormatButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
