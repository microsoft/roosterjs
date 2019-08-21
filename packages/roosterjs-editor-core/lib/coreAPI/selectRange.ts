import EditorCore, { Select, SelectRange } from '../interfaces/EditorCore';
import { Browser, contains, createRange } from 'roosterjs-editor-dom';
import { hasFocus } from './hasFocus';

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
        !(selection = core.document.defaultView.getSelection())
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
        core.cachedSelectionRange = range;
    }

    if (range.collapsed) {
        // If selected, and current selection is collapsed,
        // need to restore pending format state if exists.
        core.corePlugins.domEvent.restorePendingFormatState();
    }

    return true;
};

/**
 * @deprecated Only for compatibility with existing code, don't use ths function, use selectRange instead
 */
export const select: Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => {
    let range = arg1 instanceof Range ? arg1 : createRange(arg1, arg2, arg3, arg4);
    return core.api.selectRange(core, range);
};
