/**
 * Add the given range into selection of the given document
 * @param doc Target Document object
 * @param range The range to select
 */
export function addRangeToSelection(doc: Document, range: Range) {
    const selection = doc.defaultView?.getSelection();

    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
