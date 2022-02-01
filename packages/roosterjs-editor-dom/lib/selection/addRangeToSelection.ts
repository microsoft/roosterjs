import { Browser } from '../utils/Browser';

/**
 * Add the given range into selection of the given document
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection,
 * otherwise it will always remove current selection range and set to the given one.
 * This parameter is always treat as true in Edge to avoid some weird runtime exception.
 */
export default function addRangeToSelection(range: Range, skipSameRange?: boolean) {
    const selection = range?.commonAncestorContainer?.ownerDocument?.defaultView?.getSelection();
    if (selection) {
        let needAddRange = true;

        if (selection.rangeCount > 0) {
            // Workaround IE exception 800a025e
            try {
                let currentRange: Range | null = null;
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
    }
}
