import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent, NodeType, ContentScope } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_BLOCKQUOTEELEMENT = 'BLOCKQUOTEELEMENT';

export default function cacheGetBlockQuoteElement(editor: Editor, event?: PluginEvent): Element {
    return cacheGetEventData<Element>(event, EVENTDATACACHE_BLOCKQUOTEELEMENT, () => {
        let node = getNodeAtCursor(editor);
        return getBlockQuoteElementAtNode(editor, node) as Element;
    });
}

// Crawl up the DOM tree from given start node to find the blockquote node
export function getBlockQuoteElementAtNode(editor: Editor, node: Node): Node {
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

// Check if selection falls in a blockquote
export function isSelectionInBlockQuote(editor: Editor, nodeAtCursor: Node): boolean {
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let range = editor.getSelectionRange();

    if (contentTraverser && range && !range.collapsed) {
        // If range is not collapsed, check all block elements in selection, only return true of all of them are in blockquote
        let blockElement = contentTraverser.currentBlockElement;
        while (blockElement) {
            if (!getBlockQuoteElementAtNode(editor, blockElement.getStartNode())) {
                return false;
            }

            blockElement = contentTraverser.getNextBlockElement();
        }

        return true;
    } else {
        // Otherwise only check node at cursor
        return !!getBlockQuoteElementAtNode(editor, nodeAtCursor);
    }
}
