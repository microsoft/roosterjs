import { ContentScope, ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { Position } from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '&#8203;';

// Apply inline style to collapsed selection
// Use case is that users do not select anything, and then choose a style first (i.e. a font name), and then type and expect text to have the style
// The problem here is that there isn't a concrete DOM element to apply the style
// The workaround is to create a SPAN and have the style applied on the SPAN, and then re-position cursor within the SPAN where typing can happen
// TODO: what if user position this in an inlne element, i.e. hashtag, creating a span within an existing inline element may not be a good idea
function applyInlineStyleToCollapsedSelection(
    editor: Editor,
    styler: (element: HTMLElement) => void
): void {
    // let's just be simple to create a new span to hold the style
    // TODO: maybe we should be a bit smarter to see if we're in a span, and apply the style in parent span
    let element = editor.getDocument().createElement('SPAN');
    // Some content is needed to position selection into the span
    // for here, we inject ZWS - zero width space
    element.innerHTML = ZERO_WIDTH_SPACE;
    styler(element);
    editor.insertNode(element);

    // reset selection to be after the ZWS (rather than selecting it)
    // This is needed so that the cursor still looks blinking inside editor
    // This also means an extra ZWS will be in editor
    // TODO: somewhere in returning content to consumer, we may need to do a cleanup for ZWS
    editor.select(element, Position.End);
}

// Apply style to non collapsed selection
// It does that by looping through all inline element that can be found in the selection
// and apply style on each individual inline element
function applyInlineStyleToNonCollapsedSelection(
    editor: Editor,
    styler: (element: HTMLElement) => void
): void {
    // This is start and end node that get the style. The start and end needs to be recorded so that selection
    // can be re-applied post-applying style
    let startNode: Node;
    let endNode: Node;
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
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
        editor.select(startNode, Position.Before, endNode, Position.After);
    }
}

/**
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param styler The callback function to apply style to each element inside selection
 */
export default function applyInlineStyle(
    editor: Editor,
    styler: (element: HTMLElement) => void
): void {
    editor.focus();
    let collapsed = editor.getSelectionRange().collapsed;
    editor.formatWithUndo(
        () => {
            if (collapsed) {
                applyInlineStyleToCollapsedSelection(editor, styler);
            } else {
                applyInlineStyleToNonCollapsedSelection(editor, styler);
            }
        },
        false /*preserveSelection*/,
        ChangeSource.Format,
        null /*dataCallback*/,
        collapsed /*skipAddingUndoAfterFormat*/
    );
}
