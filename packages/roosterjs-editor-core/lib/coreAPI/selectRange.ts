import EditorCore, { Select, SelectRange } from '../interfaces/EditorCore';
import hasFocus from './hasFocus';
import { Browser, contains, createRange } from 'roosterjs-editor-dom';

const selectRange: SelectRange = (core: EditorCore, range: Range, skipSameRange?: boolean) => {
    if (contains(core.contentDiv, range)) {
        let selection = core.document.defaultView.getSelection();
        if (selection) {
            let needAddRange = true;

            if (selection.rangeCount > 0) {
                // Workaround IE exception 800a025e
                try {
                    let currentRange: Range;
                    // Do not remove/add range if current selection is the same with target range
                    // Without this check, execCommand() may fail in Edge since we changed the selection
                    if (
                        (skipSameRange || Browser.isEdge) &&
                        (currentRange =
                            selection.rangeCount == 1 ? selection.getRangeAt(0) : null) &&
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

            return true;
        }
    }

    return false;
};

export default selectRange;

/**
 * @deprecated Only for compatibility with existing code, don't use ths function, use selectRange instead
 */
export const select: Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => {
    let range = arg1 instanceof Range ? arg1 : createRange(arg1, arg2, arg3, arg4);
    return core.api.selectRange(core, range);
};
