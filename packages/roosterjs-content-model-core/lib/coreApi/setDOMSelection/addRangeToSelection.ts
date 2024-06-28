import { areSameRanges } from '../../corePlugin/cache/areSameSelections';

/**
 * @internal
 */
export function addRangeToSelection(doc: Document, range: Range, isReverted: boolean = false) {
    const selection = doc.defaultView?.getSelection();

    if (selection) {
        const currentRange = selection.rangeCount > 0 && selection.getRangeAt(0);
        if (currentRange && areSameRanges(currentRange, range)) {
            return;
        }
        selection.removeAllRanges();

        if (!isReverted) {
            selection.addRange(range);
        } else {
            selection.setBaseAndExtent(
                range.endContainer,
                range.endOffset,
                range.startContainer,
                range.startOffset
            );
        }
    }
}
