import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { GetSelectionRangeEx } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const getSelectionRangeEx: GetSelectionRangeEx = core => {
    const { cache } = core as ContentModelEditorCore;
    const { cachedRangeEx, isUpdatingRange } = cache;

    return (
        (isUpdatingRange ? undefined : cachedRangeEx) ?? core.originalApi.getSelectionRangeEx(core)
    );
};
