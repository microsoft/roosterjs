import { addRangeToSelection, contains } from 'roosterjs-editor-dom';
import type { SelectRange } from 'roosterjs-content-model-types';

/**
 * @internal
 * Change the editor selection to the given range
 * @param core The StandaloneEditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection range and set to the given one.
 * This parameter is always treat as true in Edge to avoid some weird runtime exception.
 */
export const selectRange: SelectRange = (core, range, skipSameRange) => {
    if (!core.lifecycle.shadowEditFragment && contains(core.contentDiv, range)) {
        addRangeToSelection(range, skipSameRange);

        if (!core.api.hasFocus(core)) {
            core.domEvent.selectionRange = range;
        }

        return true;
    } else {
        return false;
    }
};
