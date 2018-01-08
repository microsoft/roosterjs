import { NodeType } from 'roosterjs-editor-types';

function getWindow(currentDocument: Document) {
    return (currentDocument || document).defaultView || window;
}

/**
 * Checks if a range falls within the content Div
 * @param range The range
 * @param container The container node
 */
export function isRangeInContainer(range: Range, container: Node): boolean {
    let ancestorContainer = range ? range.commonAncestorContainer : null;

    // use the parentNode if ancestorContainer is a text node
    if (ancestorContainer && ancestorContainer.nodeType == NodeType.Text) {
        ancestorContainer = ancestorContainer.parentNode;
    }

    return (
        ancestorContainer &&
        (container == ancestorContainer || container.contains(ancestorContainer))
    );
}

/**
 * Get selection from current document
 * @param currentDocument The current document
 */
export function getSelection(currentDocument: Document) {
    return getWindow(currentDocument).getSelection();
}

/**
 * Try to get range from container node
 * @param container The container node
 */
export function tryGetSelectionRange(container: Node): Range {
    let sel = getSelection(container.ownerDocument);
    let selRange = null;
    if (sel && sel.rangeCount > 0) {
        let range = sel.getRangeAt(0);
        if (isRangeInContainer(range, container)) {
            selRange = range;
        }
    }

    return selRange;
}

/**
 * Update selection to range
 * @param currentDocument The current document
 * @param range The range to update selection to
 */
export function updateSelectionToRange(currentDocument: Document, range: Range): boolean {
    let selectionUpdated = false;
    if (range) {
        let sel = getSelection(currentDocument);
        if (sel) {
            if (sel.rangeCount > 0) {
                sel.removeAllRanges();
            }

            sel.addRange(range);
            selectionUpdated = true;
        }
    }

    return selectionUpdated;
}
