import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { Position, fromHtml } from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param styler The callback function to apply style to each element inside selection
 */
export default function applyInlineStyle(editor: Editor, styler: (element: HTMLElement) => void) {
    editor.focus();
    let collapsed = editor.getSelectionRange().collapsed;
    editor.formatWithUndo(
        () => {
            if (collapsed) {
                // Create a new span to hold the style.
                // Some content is needed to position selection into the span
                // for here, we inject ZWS - zero width space
                let element = fromHtml(
                    `<SPAN>${ZERO_WIDTH_SPACE}</SPAN>`,
                    editor.getDocument()
                )[0] as HTMLElement;
                styler(element);
                editor.insertNode(element);

                // reset selection to be after the ZWS (rather than selecting it)
                // This is needed so that the cursor still looks blinking inside editor
                // This also means an extra ZWS will be in editor
                editor.select(element, Position.End);
            } else {
                // This is start and end node that get the style. The start and end needs to be recorded so that selection
                // can be re-applied post-applying style
                let firstNode: Node;
                let lastNode: Node;
                let contentTraverser = editor.getSelectionTraverser();
                // Just loop through all inline elements in the selection and apply style for each
                let inlineElement = contentTraverser.currentInlineElement;
                while (inlineElement) {
                    // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
                    let nextInline = contentTraverser.getNextInlineElement();
                    inlineElement.applyStyle(element => {
                        styler(element);
                        firstNode = firstNode || element;
                        lastNode = element;
                    });

                    inlineElement = nextInline;
                }

                // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
                if (firstNode && lastNode) {
                    editor.select(firstNode, Position.Before, lastNode, Position.After);
                }
            }
        },
        false /*preserveSelection*/,
        ChangeSource.Format,
        null /*dataCallback*/,
        collapsed /*skipAddingUndoAfterFormat*/
    );
}
