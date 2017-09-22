import { Editor } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

// Crawl up the DOM tree from given start node to find if it falls on a blockquote
export function isBlockQuoteAtNode(editor: Editor, node: Node): boolean {
    let startNode = node && node.nodeType == NodeType.Text ? node.parentNode : node;
    while (startNode && editor.contains(startNode)) {
        let tagName = getTagOfNode(startNode);
        if (tagName == 'BLOCKQUOTE') {
            return true;
        }

        startNode = startNode.parentNode;
    }

    return false;
}

export default function getBlockQuoteElement(editor: Editor, node: Node): Node {
    let startNode = node && node.nodeType == NodeType.Text ? node.parentNode : node;
    while (startNode && editor.contains(startNode)) {
        let tagName = getTagOfNode(startNode);
        if (tagName == 'BLOCKQUOTE') {
            return startNode;
        }

        startNode = startNode.parentNode;
    }

    return null;
}