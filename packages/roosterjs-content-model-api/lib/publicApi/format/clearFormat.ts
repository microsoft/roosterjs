import { clearModelFormat } from '../../modelApi/common/clearModelFormat';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import type {
    IEditor,
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelSegment,
    ContentModelTable,
} from 'roosterjs-content-model-types';

const MAX_TRY = 3;

/**
 * Clear format of selection
 * @param editor The editor to clear format from
 */
export function clearFormat(editor: IEditor) {
    editor.focus();

    editor.formatContentModel(
        model => {
            let changed = false;
            let needtoRun = true;
            let triedTimes = 0;

            while (needtoRun && triedTimes++ < MAX_TRY) {
                const blocksToClear: [ContentModelBlockGroup[], ContentModelBlock][] = [];
                const segmentsToClear: ContentModelSegment[] = [];
                const tablesToClear: [ContentModelTable, boolean][] = [];

                needtoRun = clearModelFormat(model, blocksToClear, segmentsToClear, tablesToClear);

                normalizeContentModel(model);

                changed =
                    changed ||
                    blocksToClear.length > 0 ||
                    segmentsToClear.length > 0 ||
                    tablesToClear.length > 0;
            }

            return changed;
        },
        {
            apiName: 'clearFormat',
        }
    );
}
