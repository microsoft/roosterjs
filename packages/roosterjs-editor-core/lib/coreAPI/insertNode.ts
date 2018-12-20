import EditorCore, { InsertNode } from '../editor/EditorCore';
import { ContentPosition, InsertOption, NodeType, PositionType } from 'roosterjs-editor-types';
import {
    Position,
    changeElementTag,
    contains,
    createRange,
    getBlockElementAtNode,
    getFirstLastBlockElement,
    getTagOfNode,
    isBlockElement,
    isNodeEmpty,
    isPositionAtBeginningOf,
    isVoidHtmlElement,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

const insertNode: InsertNode = (core: EditorCore, node: Node, option: InsertOption) => {
    let position = option ? option.position : ContentPosition.SelectionStart;
    let updateCursor = option ? option.updateCursor : true;
    let replaceSelection = option ? option.replaceSelection : true;
    let insertOnNewLine = option ? option.insertOnNewLine : false;
    let contentDiv = core.contentDiv;

    if (updateCursor) {
        core.api.focus(core);
    }

    switch (position) {
        case ContentPosition.Begin:
        case ContentPosition.End:
            let isBegin = position == ContentPosition.Begin;
            let block = getFirstLastBlockElement(contentDiv, isBegin);
            let insertedNode: Node;
            if (block) {
                let refNode = isBegin ? block.getStartNode() : block.getEndNode();
                let refParentNode = refNode.parentNode;
                if (
                    insertOnNewLine ||
                    refNode.nodeType == NodeType.Text ||
                    isVoidHtmlElement(refNode)
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
                // No first block, this can happen when editor is empty. Use appendChild to insert the content in contentDiv
                insertedNode = contentDiv.appendChild(node);
            }

            // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
            // add a DIV wrapping
            if (insertedNode && insertOnNewLine && !isBlockElement(insertedNode)) {
                wrap(insertedNode);
            }

            break;
        case ContentPosition.SelectionStart:
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            if (range) {
                // if to replace the selection and the selection is not collapsed, remove the the content at selection first
                if (replaceSelection && !range.collapsed) {
                    range.deleteContents();
                }

                // Create a clone (backup) for the selection first as we may need to restore to it later
                let clonedRange = range.cloneRange();
                let position = Position.getStart(range).normalize();
                let blockElement = getBlockElementAtNode(contentDiv, position.node);

                if (blockElement) {
                    let endNode = blockElement.getEndNode();
                    if (insertOnNewLine) {
                        // Adjust the insertion point
                        // option.insertOnNewLine means to insert on a block after the selection, not really right at the selection
                        // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
                        // and insert signature, they actually want signature to be inserted the line after the selection
                        range.setEndAfter(endNode);
                        range.collapse(false /*toStart*/);
                    } else {
                        range = preprocessNode(core, range, node, endNode);
                    }
                }

                let nodeForCursor =
                    node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
                range.insertNode(node);
                if (updateCursor && nodeForCursor) {
                    core.api.select(
                        core,
                        new Position(nodeForCursor, PositionType.After).normalize()
                    );
                } else {
                    core.api.select(core, clonedRange);
                }
            }
            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, contentDiv.nextSibling);
            break;
    }

    return true;
};

export default insertNode;

function preprocessNode(
    core: EditorCore,
    range: Range,
    nodeToInsert: Node,
    currentNode: Node
): Range {
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
                if (
                    isNodeEmpty(listNode) ||
                    isPositionAtBeginningOf(Position.getStart(range), listNode)
                ) {
                    range.setEndBefore(listNode);
                } else {
                    range.setEndAfter(listNode);
                }
                range.collapse(false /*toStart*/);
                unwrap(rootNodeToInsert);
            }
        }
    }

    if (getTagOfNode(currentNode) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        let start = Position.getStart(range).normalize();
        let end = Position.getEnd(range).normalize();
        let div = changeElementTag(<HTMLElement>currentNode, 'div');
        let newRange = createRange(start, end);
        if (start.node != div && end.node != div && contains(core.contentDiv, newRange)) {
            range = newRange;
        }
    }

    if (isVoidHtmlElement(range.endContainer)) {
        range.setEndBefore(range.endContainer);
    }

    return range;
}
