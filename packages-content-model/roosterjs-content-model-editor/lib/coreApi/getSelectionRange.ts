import { contains, createRange } from 'roosterjs-editor-dom';
import type { GetSelectionRange } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get current or cached selection range
 * @param core The StandaloneEditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export const getSelectionRange: GetSelectionRange = (core, tryGetFromCache: boolean) => {
    let result: Range | null = null;

    if (core.lifecycle.shadowEditFragment) {
        result =
            core.lifecycle.shadowEditSelectionPath &&
            createRange(
                core.contentDiv,
                core.lifecycle.shadowEditSelectionPath.start,
                core.lifecycle.shadowEditSelectionPath.end
            );

        return result;
    } else {
        if (!tryGetFromCache || core.api.hasFocus(core)) {
            const selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (contains(core.contentDiv, range)) {
                    result = range;
                }
            }
        }

        if (!result && tryGetFromCache) {
            result = core.domEvent.selectionRange;
        }

        return result;
    }
};
