import { clearModelFormat } from '../../modelApi/format/clearModelFormat';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelSegment,
    ContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * Clear format of selection
 * @param editor The editor to clear format from
 */
export function clearFormat(editor: IContentModelEditor) {
    editor.focus();

    editor.formatContentModel(
        model => {
            const blocksToClear: [ContentModelBlockGroup[], ContentModelBlock][] = [];
            const segmentsToClear: ContentModelSegment[] = [];
            const tablesToClear: [ContentModelTable, boolean][] = [];

            clearModelFormat(model, blocksToClear, segmentsToClear, tablesToClear);

            normalizeContentModel(model);

            return (
                blocksToClear.length > 0 || segmentsToClear.length > 0 || tablesToClear.length > 0
            );
        },
        {
            apiName: 'clearFormat',
        }
    );
}
