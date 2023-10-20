/**
 * @internal
 */
export function addRangeToSelection(doc: Document, range: Range) {
    const selection = doc.defaultView?.getSelection();

    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
