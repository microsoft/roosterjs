import { ChangeSource, IEditor, NodeType, PositionType } from 'roosterjs-editor-types';
import {
    applyTextStyle,
    ContentTraverser,
    findClosestElementAncestor,
    getSelectedTableCells,
    getTagOfNode,
} from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * @internal
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param callback The callback function to apply style
 */
export default function applyInlineStyle(
    editor: IEditor,
    callback: (element: HTMLElement, isInnerNode?: boolean) => any
) {
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
            let rangeContainsOnlyTable: boolean = true;
            const selectedCells = Array.from(getSelectedTableCells(editor));

            let contentTraverser = editor.getSelectionTraverser();
            let inlineElement = contentTraverser && contentTraverser.currentInlineElement;

            while (inlineElement) {
                let nextInlineElement = contentTraverser.getNextInlineElement();
                inlineElement.applyStyle((element, isInnerNode) => {
                    const closestTD =
                        getTagOfNode(element) == 'TD'
                            ? element
                            : findClosestElementAncestor(element, null, 'TD');
                    if (closestTD && selectedCells.length > 0) {
                        element = (rangeContainsOnlyTable
                            ? selectedCells[0]
                            : selectedCells[selectedCells.length - 1]) as HTMLElement;
                    } else {
                        callback(element, isInnerNode);
                        rangeContainsOnlyTable = false;
                    }

                    firstNode = firstNode || element;
                    lastNode = element;
                });
                inlineElement = nextInlineElement;
            }

            selectedCells.forEach(cell => {
                const blockRange = new Range();
                blockRange.setStartBefore(cell);
                blockRange.setEndAfter(cell);
                const contentTraverser = ContentTraverser.createBlockTraverser(cell, blockRange);
                let inlineElement = contentTraverser && contentTraverser.currentInlineElement;
                while (inlineElement) {
                    let nextInlineElement = contentTraverser.getNextInlineElement();
                    inlineElement.applyStyle(callback);
                    inlineElement = nextInlineElement;
                }
            });

            if (rangeContainsOnlyTable) {
                editor.select(
                    selectedCells[0],
                    PositionType.Before,
                    selectedCells[selectedCells.length - 1],
                    PositionType.After
                );
            } else if (firstNode && lastNode) {
                editor.select(firstNode, PositionType.Before, lastNode, PositionType.After);
            }
        }, ChangeSource.Format);
    }
}
