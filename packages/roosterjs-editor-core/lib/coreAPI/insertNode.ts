import EditorCore, { InsertNode } from '../interfaces/EditorCore';
import {
    ContentPosition,
    InsertOption,
    NodeType,
    PositionType,
    BlockElement,
} from 'roosterjs-editor-types';
import {
    Position,
    getBlockElementAtNode,
    getFirstLastBlockElement,
    isBlockElement,
    isVoidHtmlElement,
    wrap,
    mergeNode,
    createRange,
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
                if (
                    insertOnNewLine ||
                    refNode.nodeType == NodeType.Text ||
                    isVoidHtmlElement(refNode)
                ) {
                    // For insert on new line, or refNode is text or void html element (HR, BR etc.)
                    // which cannot have children, i.e. <div>hello<br>world</div>. 'hello', 'world' are the
                    // first and last node. Insert before 'hello' or after 'world', but still inside DIV
                    insertedNode = refNode.parentNode.insertBefore(
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
            if (!range) {
                return;
            }

            // if to replace the selection and the selection is not collapsed, remove the the content at selection first
            if (replaceSelection && !range.collapsed) {
                range.deleteContents();
            }

            // Create a clone (backup) for the selection first as we may need to restore to it later
            let clonedRange = range.cloneRange();
            let pos = Position.getStart(range);
            let blockElement: BlockElement;

            if (
                insertOnNewLine &&
                (blockElement = getBlockElementAtNode(contentDiv, pos.normalize().node))
            ) {
                pos = new Position(blockElement.getEndNode(), PositionType.After);
            } else {
                pos = mergeNode(contentDiv, node, pos);
            }

            let nodeForCursor = node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
            range = createRange(pos);
            range.insertNode(node);
            if (updateCursor && nodeForCursor) {
                core.api.select(core, new Position(nodeForCursor, PositionType.After).normalize());
            } else {
                core.api.select(core, clonedRange);
            }

            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, contentDiv.nextSibling);
            break;
    }

    return true;
};

export default insertNode;
