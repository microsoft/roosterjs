import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Browser, getTagOfNode, splitParentNode, unwrap, wrap } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

var ZERO_WIDTH_SPACE = '&#8203;';

let defaultStyler = (element: HTMLElement) => {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};

/**
 * Toggle blockquote at selection, if selection already contains any blockquoted elements,
 * the blockquoted elements will be unblockquoted and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the
 * blockquote element
 */
export default function toggleBlockQuote(editor: Editor, styler?: (element: HTMLElement) => void) {
    editor.focus();
    let blockquoteNodes = queryNodesWithSelection(editor, 'blockquote');
    editor.addUndoSnapshot((start, end) => {
        let quoteElement: HTMLElement;

        if (blockquoteNodes.length) {
            // There are already blockquote nodes, unwrap them
            blockquoteNodes.forEach(node => unwrap(node));
        } else {
            // Step 1: Find all block elements and their content nodes
            let nodes = getContentNodes(editor);

            // Step 2: Split existing list container if necessary
            nodes = getSplittedListNodes(nodes);

            // Step 3: Handle some special cases
            nodes = getNodesWithSpecialCaseHandled(editor, nodes);

            quoteElement = wrap(nodes, 'blockquote');
            (styler || defaultStyler)(quoteElement);
        }

        if (!editor.select(start, end) && quoteElement) {
            editor.select(quoteElement);
        }
    });
}

function getContentNodes(editor: Editor): Node[] {
    let result: Node[] = [];
    let contentTraverser = editor.getSelectionTraverser();
    let blockElement = contentTraverser ? contentTraverser.currentBlockElement : null;
    while (blockElement) {
        let nodes = blockElement.getContentNodes();
        for (let node of nodes) {
            let listElement = getNodeAtCursor(editor, 'LI', node);
            if (!listElement) {
                result.push(node);
            } else if (listElement != result[result.length - 1]) {
                result.push(listElement);
            }
        }
        blockElement = contentTraverser.getNextBlockElement();
    }
    return result;
}

function getSplittedListNodes(nodes: Node[]): Node[] {
    for (let changed = true, currentListNode = null; changed; ) {
        changed = false;
        for (let i = 0; i < nodes.length; i++) {
            // When we are in list, check if the whole list is in selection.
            // If so, use the list element instead of each item
            let node = nodes[i];
            if (isListElement(node)) {
                let parentNode = node.parentNode;
                let firstIndex = nodes.indexOf(parentNode.firstChild);
                let nodeCount = parentNode.childNodes.length;

                // If all children are in the list, remove these nodes and use parent node instead
                if (firstIndex >= 0 && nodes[firstIndex + nodeCount - 1] == parentNode.lastChild) {
                    nodes.splice(firstIndex, nodeCount, parentNode);
                    i = firstIndex - 1;
                }
            }
        }

        // Use "i <= nodes.length" to do one more round of loop to perform a fianl round of parent node splitting
        for (let i = 0; i <= nodes.length; i++) {
            let node = nodes[i];
            if (isListElement(node)) {
                if (!currentListNode || node.parentNode != currentListNode.parentNode) {
                    changed = !!splitParentNode(node, true /*splitBefore*/) || changed;
                }
                currentListNode = node;
            } else if (currentListNode) {
                changed = !!splitParentNode(currentListNode, false /*splitBefore*/) || changed;
                currentListNode = null;
            }
        }
    }
    return nodes;
}

function getNodesWithSpecialCaseHandled(editor: Editor, nodes: Node[]): Node[] {
    if (nodes.length == 1 && nodes[0].nodeName == 'BR') {
        nodes[0] = wrap(nodes[0]);
    } else if (nodes.length == 0) {
        let document = editor.getDocument();
        // Selection is collapsed and blockElment is null, we need to create an empty div.
        // In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node.
        let div = document.createElement('div');
        div.appendChild(
            Browser.isIEOrEdge
                ? document.createTextNode(ZERO_WIDTH_SPACE)
                : document.createElement('BR')
        );

        editor.insertNode(div);
        nodes.push(div);
        editor.select(div, PositionType.Begin);
    }
    return nodes;
}

function isListElement(node: Node) {
    let parentTag = node ? getTagOfNode(node.parentNode) : '';
    return parentTag == 'OL' || parentTag == 'UL';
}
