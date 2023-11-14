import {
    contains,
    getPendableFormatState,
    Position,
    PendableFormatCommandMap,
    addRangeToSelection,
    getObjectKeys,
} from 'roosterjs-editor-dom';
import type { SelectRange, StandaloneEditorCore } from 'roosterjs-content-model-types';

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
    if (!core.lifecycle.shadowEditSelectionPath && contains(core.contentDiv, range)) {
        addRangeToSelection(range, skipSameRange);

        if (!core.api.hasFocus(core)) {
            core.domEvent.selectionRange = range;
        }

        if (range.collapsed) {
            // If selected, and current selection is collapsed,
            // need to restore pending format state if exists.
            restorePendingFormatState(core);
        }

        return true;
    } else {
        return false;
    }
};

/**
 * Restore cached pending format state (if exist) to current selection
 */
function restorePendingFormatState(core: StandaloneEditorCore) {
    const {
        contentDiv,
        pendingFormatState,
        api: { getSelectionRange },
    } = core;

    if (pendingFormatState.pendableFormatState) {
        const document = contentDiv.ownerDocument;
        const formatState = getPendableFormatState(document);
        getObjectKeys(PendableFormatCommandMap).forEach(key => {
            if (!!pendingFormatState.pendableFormatState?.[key] != formatState[key]) {
                document.execCommand(
                    PendableFormatCommandMap[key],
                    false /* showUI */,
                    undefined /* value */
                );
            }
        });

        const range = getSelectionRange(core, true /*tryGetFromCache*/);
        const position: Position | null = range && Position.getStart(range);
        if (position) {
            pendingFormatState.pendableFormatPosition = position;
        }
    }
}
