import { ChangeSource, IEditor, SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Wrap to add a undo snapshot before applying format, if there are more than one range.
 * Otherwise, for each range an undosnapshot would be added.
 * @param editor editor instance
 * @param selectionRange selection ranges
 * @param callback callback to use on all the ranges
 * @param changeSource Optional parameter to add to the parent undoSnapshot
 */
export function multipleSelectionRangesWrap(
    editor: IEditor,
    selectionRange: SelectionRangeEx,
    callback: (range: Range) => void,
    changeSource?: ChangeSource
) {
    if (selectionRange.ranges.length > 1) {
        editor.addUndoSnapshot(() => forEachRange(selectionRange, callback), changeSource);
    } else {
        forEachRange(selectionRange, callback);
    }
}

function forEachRange(selectionRange: SelectionRangeEx, callback: (range: Range) => void): void {
    selectionRange.ranges.forEach(range => {
        callback(range);
    });
}
