import { NodeType } from 'roosterjs-editor-types';

function getWindow(currentDocument: Document) {
    return (currentDocument || document).defaultView || window;
}

// Checks if a range falls within the content Div
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

export function getSelection(currentDocument: Document) {
    return getWindow(currentDocument).getSelection();
}

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
