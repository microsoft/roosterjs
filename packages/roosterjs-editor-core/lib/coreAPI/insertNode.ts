import EditorCore, { InsertNode } from '../editor/EditorCore';
import {
    SelectionRange,
    changeElementTag,
    contains,
    getBlockElementAtNode,
    getLeafNode,
    getTagOfNode,
    isBlockElement,
    isNodeEmpty,
    isVoidHtmlElement,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';
import { ContentPosition, InsertOption, NodeType, PositionType } from 'roosterjs-editor-types';

const HTML_EMPTY_DIV = '<div></div>';

const insertNode: InsertNode = (core: EditorCore, node: Node, option?: InsertOption) => {
    let position = option ? option.position : ContentPosition.SelectionStart;
    let updateCursor = option ? option.updateCursor : true;
    let replaceSelection = option ? option.replaceSelection : true;
    let insertOnNewLine = option ? option.insertOnNewLine : false;

    if (updateCursor) {
        core.api.focus(core);
    }

    switch (position) {
        case ContentPosition.Begin:
        case ContentPosition.End:
            let isBegin = position == ContentPosition.Begin;
            let contentDiv = core.contentDiv;
            let block = getBlockElementAtNode(contentDiv, getLeafNode(contentDiv, isBegin));
            let insertedNode: Node;
            if (block) {
                let refNode = isBegin ? block.getStartNode() : block.getEndNode();
                let refParentNode = refNode.parentNode;
                if (
                    insertOnNewLine ||
                    refNode.nodeType == NodeType.Text ||
                    isVoidHtmlElement(refNode as HTMLElement)
                ) {
                    // For insert on new line, or refNode is text or void html element (HR, BR etc.)
                    // which cannot have children, i.e. <div>hello<br>world</div>. 'hello', 'world' are the
                    // first and last node. Insert before 'hello' or after 'world', but still inside DIV
                    insertedNode = refParentNode.insertBefore(
                        node,
                        isBegin ? refNode : refNode.nextSibling
                    );
                } else {
                    // if the refNode can have child, use appendChild (which is like to insert as first/last child)
                    // i.e. <div>hello</div>, the content will be inserted before/after hello
                    insertedNode = refNode.insertBefore(node, isBegin ? refNode.firstChild : null);
                }
            } else {
                // No last block, editor is likely empty, use appendChild
                insertedNode = core.contentDiv.appendChild(node);
            }

            // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
            // add a DIV wrapping
            if (insertedNode && insertOnNewLine && !isBlockElement(insertedNode)) {
                wrap(insertedNode, HTML_EMPTY_DIV);
            }

            break;
        case ContentPosition.SelectionStart:
            let rawRange = core.api.getLiveRange(core) || core.cachedRange;
            if (rawRange) {
                // if to replace the selection and the selection is not collapsed, remove the the content at selection first
                if (replaceSelection && !rawRange.collapsed) {
                    rawRange.deleteContents();
                }

                // Create a clone (backup) for the selection first as we may need to restore to it later
                let clonedRange = new SelectionRange(rawRange);

                let blockElement = getBlockElementAtNode(core.contentDiv, rawRange.startContainer);

                if (blockElement) {
                    let endNode = blockElement.getEndNode();
                    if (insertOnNewLine) {
                        // Adjust the insertion point
                        // insertOnNewLine means to insert on a block after the selection, not really right at the selection
                        // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
                        // and insert signature, they actually want signature to be inserted the line after the selection
                        rawRange.setEndAfter(endNode);
                        rawRange.collapse(false /*toStart*/);
                    } else {
                        preprocessNode(core, rawRange, node, endNode);
                    }
                }

                let nodeForCursor =
                    node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
                rawRange.insertNode(node);

                if (updateCursor && nodeForCursor) {
                    core.api.select(core, nodeForCursor, PositionType.After);
                } else {
                    core.api.select(core, clonedRange);
                }
            }
            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, core.contentDiv.nextSibling);
            break;
    }

    return true;
};

export default insertNode;

function preprocessNode(core: EditorCore, rawRange: Range, nodeToInsert: Node, currentNode: Node) {
    let rootNodeToInsert = nodeToInsert;

    if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
        let rootNodes = (<Node[]>[].slice.call(rootNodeToInsert.childNodes)).filter(
            n => getTagOfNode(n) != 'BR'
        );
        rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
    }

    let tag = getTagOfNode(rootNodeToInsert);

    if ((tag == 'OL' || tag == 'UL') && getTagOfNode(rootNodeToInsert.firstChild) == 'LI') {
        let shouldInsertListAsText =
            !rootNodeToInsert.firstChild.nextSibling &&
            getTagOfNode(rootNodeToInsert.nextSibling) != 'BR';

        if (getTagOfNode(rootNodeToInsert.nextSibling) == 'BR' && rootNodeToInsert.parentNode) {
            rootNodeToInsert.parentNode.removeChild(rootNodeToInsert.nextSibling);
        }

        if (shouldInsertListAsText) {
            unwrap(rootNodeToInsert.firstChild);
            unwrap(rootNodeToInsert);
        } else {
            let listNode = currentNode;
            while (
                getTagOfNode(listNode.parentNode) != tag &&
                contains(core.contentDiv, listNode)
            ) {
                listNode = listNode.parentNode;
            }

            if (getTagOfNode(listNode.parentNode) == tag) {
                if (isNodeEmpty(listNode) || isSelectionAtBeginningOf(rawRange, listNode)) {
                    rawRange.setEndBefore(listNode);
                } else {
                    rawRange.setEndAfter(listNode);
                }
                rawRange.collapse(false /*toStart*/);
                unwrap(rootNodeToInsert);
            }
        }
    }

    if (getTagOfNode(currentNode) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        let rangeCache = new SelectionRange(rawRange).normalize();
        let div = changeElementTag(currentNode as HTMLElement, 'div');
        if (
            rangeCache.start.node != div &&
            rangeCache.end.node != div &&
            contains(core.contentDiv, rangeCache)
        ) {
            rawRange = rangeCache.getRange();
        }
    }
    if (isVoidHtmlElement(rawRange.endContainer as HTMLElement)) {
        rawRange.setEndBefore(rawRange.endContainer);
    }
}

function isSelectionAtBeginningOf(range: Range, node: Node) {
    if (range) {
        if (
            range.startOffset > 0 &&
            range.startContainer.nodeType == NodeType.Element &&
            range.startContainer.childNodes[range.startOffset] == node
        ) {
            return true;
        } else if (range.startOffset == 0) {
            let container = range.startContainer;
            while (
                container != node &&
                contains(node, container) &&
                (!container.previousSibling || isNodeEmpty(container.previousSibling))
            ) {
                container = container.parentNode;
            }

            if (container == node) {
                return true;
            }
        }
    }
    return false;
}
