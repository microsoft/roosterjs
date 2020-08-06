import EditorCore, { SelectRange } from '../interfaces/EditorCore';
import { hasFocus } from './hasFocus';
import {
    Browser,
    contains,
    getPendableFormatState,
    Position,
    PendableFormatNames,
    PendableFormatCommandMap,
} from 'roosterjs-editor-dom';
/**
 * Change the editor selection to the given range
 * @param core The EditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection ranage and set to the given one.
 * This parameter is always treat as true in Edge to avoid some weird runtime exception.
 */
export const selectRange: SelectRange = (
    core: EditorCore,
    range: Range,
    skipSameRange?: boolean
) => {
    let selection: Selection;
    let needAddRange = true;

    if (
        !contains(core.contentDiv, range) ||
        !(selection = core.contentDiv.ownerDocument.defaultView.getSelection())
    ) {
        return false;
    }

    if (selection.rangeCount > 0) {
        // Workaround IE exception 800a025e
        try {
            let currentRange: Range;
            // Do not remove/add range if current selection is the same with target range
            // Without this check, execCommand() may fail in Edge since we changed the selection
            if (
                (skipSameRange || Browser.isEdge) &&
                (currentRange = selection.rangeCount == 1 ? selection.getRangeAt(0) : null) &&
                currentRange.startContainer == range.startContainer &&
                currentRange.startOffset == range.startOffset &&
                currentRange.endContainer == range.endContainer &&
                currentRange.endOffset == range.endOffset
            ) {
                needAddRange = false;
            } else {
                selection.removeAllRanges();
            }
        } catch (e) {}
    }

    if (needAddRange) {
        selection.addRange(range);
    }

    if (!hasFocus(core)) {
        core.domEvent.value.selectionRange = range;
    }

    if (range.collapsed) {
        // If selected, and current selection is collapsed,
        // need to restore pending format state if exists.
        restorePendingFormatState(core);
    }

    return true;
};

/**
 * Restore cached pending format state (if exist) to current selection
 */
function restorePendingFormatState(core: EditorCore) {
    const {
        contentDiv,
        pendingFormatState: { value },
        api: { getSelectionRange },
    } = core;

    if (value.pendableFormatState) {
        const document = contentDiv.ownerDocument;
        let formatState = getPendableFormatState(document);
        (<PendableFormatNames[]>Object.keys(PendableFormatCommandMap)).forEach(key => {
            if (!!value.pendableFormatState[key] != formatState[key]) {
                document.execCommand(PendableFormatCommandMap[key], false, null);
            }
        });

        const range = getSelectionRange(core, true /*tryGetFromCache*/);
        value.pendableFormatPosition = range && Position.getStart(range);
    }
}
