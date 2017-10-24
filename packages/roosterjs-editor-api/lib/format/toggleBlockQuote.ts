import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { getListElementAtNode } from './cacheGetListElement';
import { getTagOfNode, splitParentNode, unwrap, wrapAll, wrap } from 'roosterjs-editor-dom';
import { ContentScope, EditorPoint, NodeBoundary } from 'roosterjs-editor-types';
import { Editor, browserData } from 'roosterjs-editor-core';

var ZERO_WIDTH_SPACE = '&#8203;';

let defaultStyler = (element: HTMLElement) => {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};

export default function toggleBlockQuote(
    editor: Editor,
    styler?: (element: HTMLElement) => void
): void {
    editor.focus();
    let range = editor.getSelectionRange();
    if (range) {
        let startPoint = { containerNode: range.startContainer, offset: range.startOffset };
        let endPoint = { containerNode: range.endContainer, offset: range.endOffset };
        let blockquoteNodes = queryNodesWithSelection(editor, 'blockquote');
        execFormatWithUndo(editor, () => {
            if (blockquoteNodes.length) {
                // There are already blockquote nodes, unwrap them
                blockquoteNodes.forEach(node => unwrap(node));
            } else {
                // Step 1: Find all block elements and their content nodes
                let nodes = getContentNodes(editor);

                // Step 2: Split existing list container if necessary
                nodes = getSplittedListNodes(nodes);

                // Step 3: Handle some special cases
                nodes = getNodesWithSpecialCaseHandled(editor, nodes, startPoint, endPoint);

                let quoteElement = wrapAll(nodes, '<blockquote></blockqupte>') as HTMLElement;
                (styler || defaultStyler)(quoteElement);
            }
            updateSelection(editor, startPoint, endPoint);
        });
    }
}

function getContentNodes(editor: Editor): Node[] {
    let result: Node[] = [];
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let blockElement = contentTraverser ? contentTraverser.currentBlockElement : null;
    while (blockElement) {
        let nodes = blockElement.getContentNodes();
        for (let node of nodes) {
            let listElement = getListElementAtNode(editor, node, 'LI');
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

function getNodesWithSpecialCaseHandled(
    editor: Editor,
    nodes: Node[],
    startPoint: EditorPoint,
    endPoint: EditorPoint
): Node[] {
    if (nodes.length == 1 && nodes[0].nodeName == 'BR') {
        nodes[0] = wrap(nodes[0], '<div></div>') as HTMLDivElement;
    } else if (nodes.length == 0) {
        let document = editor.getDocument();
        // Selection is collapsed and blockElment is null, we need to create an empty div.
        // In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node.
        let div = document.createElement('div');
        div.appendChild(
            browserData.isEdge || browserData.isIE
                ? document.createTextNode(ZERO_WIDTH_SPACE)
                : document.createElement('BR')
        );

        editor.insertNode(div);
        nodes.push(div);
        startPoint.containerNode = endPoint.containerNode = div;
        startPoint.offset = endPoint.offset = NodeBoundary.Begin;
    }
    return nodes;
}

function isListElement(node: Node) {
    let parentTag = node ? getTagOfNode(node.parentNode) : '';
    return parentTag == 'OL' || parentTag == 'UL';
}

function updateSelection(editor: Editor, startPoint: EditorPoint, endPoint: EditorPoint) {
    editor.focus();
    let range = editor.getDocument().createRange();
    if (startPoint.containerNode && editor.contains(startPoint.containerNode)) {
        range.setStart(startPoint.containerNode, startPoint.offset);
    }
    if (endPoint.containerNode && editor.contains(endPoint.containerNode)) {
        range.setEnd(endPoint.containerNode, endPoint.offset);
    }

    editor.updateSelection(range);
}
