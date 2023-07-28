import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { GetSelectionRangeEx } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const getSelectionRangeEx: GetSelectionRangeEx = core => {
    const contentModelCore = core as ContentModelEditorCore;

    return contentModelCore.cachedRangeEx ?? core.originalApi.getSelectionRangeEx(core);
};
