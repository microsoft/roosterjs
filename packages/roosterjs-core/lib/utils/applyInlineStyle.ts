import { ContentTraverser } from 'roosterjs-dom';
import { updateSelectionToRange, tryGetSelectionRange } from './selection';

const ZERO_WIDTH_SPACE = '&#8203;';

// Apply inline style to collapsed selection
// Use case is that users do not select anything, and then choose a style first (i.e. a font name), and then type and expect text to have the style
// The problem here is that there isn't a concrete DOM element to apply the style
// The workaround is to create a SPAN and have the style applied on the SPAN, and then re-position cursor within the SPAN where typing can happen
// TODO: what if user position this in an inlne element, i.e. hashtag, creating a span within an existing inline element may not be a good idea
function applyInlineStyleToCollapsedSelection(
    currentDocument: Document,
    selectionRange: Range,
    styler: (element: HTMLElement) => void
): void {
    // let's just be simple to create a new span to hold the style
    // TODO: maybe we should be a bit smarter to see if we're in a span, and apply the style in parent span
    let element = currentDocument.createElement('SPAN');
    // Some content is needed to position selection into the span
    // for here, we inject ZWS - zero width space
    element.innerHTML = ZERO_WIDTH_SPACE;
    styler(element);
    selectionRange.insertNode(element);

    // reset selection to be after the ZWS (rather than selecting it)
    // This is needed so that the cursor still looks blinking inside editor
    // This also means an extra ZWS will be in editor
    // TODO: somewhere in returning content to consumer, we may need to do a cleanup for ZWS
    let updatedRange = currentDocument.createRange();
    updatedRange.selectNodeContents(element);
    updatedRange.collapse(false /* toStart */);
    updateSelectionToRange(currentDocument, updatedRange);
}

// Apply style to non collapsed selection
// It does that by looping through all inline element that can be found in the selection
// and apply style on each individual inline element
function applyInlineStyleToNonCollapsedSelection(
    currentDocument: Document,
    contentTraverser: ContentTraverser,
    selectionRange: Range,
    styler: (element: HTMLElement) => void
): void {
    // This is start and end node that get the style. The start and end needs to be recorded so that selection
    // can be re-applied post-applying style
    let startNode: Node;
    let endNode: Node;

    // Just loop through all inline elements in the selection and apply style for each
    let startInline = contentTraverser.currentInlineElement;
    while (startInline) {
        // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
        let nextInline = contentTraverser.getNextInlineElement();
        startInline.applyStyle((element: HTMLElement) => {
            styler(element);
            if (!startNode) {
                startNode = element;
            }
            endNode = element;
        });

        startInline = nextInline;
    }

    // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
    if (startNode && endNode) {
        // Set the selection
        let updatedRange = currentDocument.createRange();
        updatedRange.setStartBefore(startNode);
        updatedRange.setEndAfter(endNode);
        updateSelectionToRange(currentDocument, updatedRange);
    }
}

// Apply inline style to current selection
function applyInlineStyle(
    container: Node,
    contentTraverser: ContentTraverser,
    styler: (element: HTMLElement) => void
): void {
    let currentDocument = container.ownerDocument;
    let selectionRange = tryGetSelectionRange(container);
    if (selectionRange) {
        // TODO: Chrome has a bug that when the selection spans over several empty text nodes,
        // it may incorrectly report range not to be collapsed.
        // We may do a browser check to force it to go collapsed code path when we see an empty range
        // UserAgent.GetInstance().IsBrowserChrome && range.toString() == _String.Empty
        if (selectionRange.collapsed) {
            applyInlineStyleToCollapsedSelection(currentDocument, selectionRange, styler);
        } else {
            applyInlineStyleToNonCollapsedSelection(
                currentDocument,
                contentTraverser,
                selectionRange,
                styler
            );
        }
    }
}

export default applyInlineStyle;
