import { EditorCore, SelectRange } from 'roosterjs-editor-types';
import { hasFocus } from './hasFocus';
import {
    contains,
    getPendableFormatState,
    Position,
    PendableFormatCommandMap,
    addRangeToSelection,
    getObjectKeys,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Change the editor selection to the given range
 * @param core The EditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection range and set to the given one.
 * This parameter is always treat as true in Edge to avoid some weird runtime exception.
 */
export const selectRange: SelectRange = (
    core: EditorCore,
    range: Range,
    skipSameRange?: boolean
) => {
    if (!core.lifecycle.shadowEditSelectionPath && contains(core.contentDiv, range)) {
        addRangeToSelection(range, skipSameRange);

        if (!hasFocus(core)) {
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
function restorePendingFormatState(core: EditorCore) {
    const {
        contentDiv,
        pendingFormatState,
        api: { getSelectionRange },
    } = core;

    if (pendingFormatState.pendableFormatState) {
        const document = contentDiv.ownerDocument;
        let formatState = getPendableFormatState(document);
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
        let position: Position | null = range && Position.getStart(range);
        if (position) {
            pendingFormatState.pendableFormatPosition = position;
        }
    }
}
