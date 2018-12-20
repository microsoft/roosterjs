import { applyTextStyle, getTagOfNode } from 'roosterjs-editor-dom';
import { ChangeSource, NodeType, PositionType } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param callback The callback function to apply style
 */
export default function applyInlineStyle(editor: Editor, callback: (element: HTMLElement) => any) {
    editor.focus();
    let range = editor.getSelectionRange();

    if (range && range.collapsed) {
        let node = range.startContainer;
        let isEmptySpan =
            getTagOfNode(node) == 'SPAN' &&
            (!node.firstChild ||
                (getTagOfNode(node.firstChild) == 'BR' && !node.firstChild.nextSibling));
        if (isEmptySpan) {
            editor.addUndoSnapshot();
            callback(node as HTMLElement);
        } else {
            let isZWSNode =
                node &&
                node.nodeType == NodeType.Text &&
                node.nodeValue == ZERO_WIDTH_SPACE &&
                getTagOfNode(node.parentNode) == 'SPAN';

            if (!isZWSNode) {
                editor.addUndoSnapshot();
                // Create a new text node to hold the selection.
                // Some content is needed to position selection into the span
                // for here, we inject ZWS - zero width space
                node = editor.getDocument().createTextNode(ZERO_WIDTH_SPACE);
                range.insertNode(node);
            }

            applyTextStyle(node, callback);
            editor.select(node, PositionType.End);
        }
    } else {
        // This is start and end node that get the style. The start and end needs to be recorded so that selection
        // can be re-applied post-applying style
        editor.addUndoSnapshot(() => {
            let firstNode: Node;
            let lastNode: Node;
            let contentTraverser = editor.getSelectionTraverser();
            let inlineElement = contentTraverser && contentTraverser.currentInlineElement;
            while (inlineElement) {
                let nextInlineElement = contentTraverser.getNextInlineElement();
                inlineElement.applyStyle(element => {
                    callback(element);
                    firstNode = firstNode || element;
                    lastNode = element;
                });
                inlineElement = nextInlineElement;
            }
            if (firstNode && lastNode) {
                editor.select(firstNode, PositionType.Before, lastNode, PositionType.After);
            }
        }, ChangeSource.Format);
    }
}
