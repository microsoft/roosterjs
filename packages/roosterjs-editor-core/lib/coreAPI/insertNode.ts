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
    adjustNodeInsertPosition,
    createRange,
} from 'roosterjs-editor-dom';

function getInitialRange(
    core: EditorCore,
    option: InsertOption
): { range: Range; rangeToRestore: Range } {
    // Selection start replaces based on the current selection.
    // Range inserts based on a provided range.
    // Both have the potential to use the current selection to restore cursor position
    // So in both cases we need to store the selection state.
    let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
    let rangeToRestore = null;
    if (option.position == ContentPosition.Range) {
        rangeToRestore = range;
        range = option.range;
    } else if (range) {
        rangeToRestore = range.cloneRange();
    }

    return { range, rangeToRestore };
}

const insertNode: InsertNode = (core: EditorCore, node: Node, option: InsertOption) => {
    option = option || {
        position: ContentPosition.SelectionStart,
        insertOnNewLine: false,
        updateCursor: true,
        replaceSelection: true,
    };
    let contentDiv = core.contentDiv;

    if (option.updateCursor) {
        core.api.focus(core);
    }

    switch (option.position) {
        case ContentPosition.Begin:
        case ContentPosition.End:
            let isBegin = option.position == ContentPosition.Begin;
            let block = getFirstLastBlockElement(contentDiv, isBegin);
            let insertedNode: Node;
            if (block) {
                let refNode = isBegin ? block.getStartNode() : block.getEndNode();
                if (
                    option.insertOnNewLine ||
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
            if (insertedNode && option.insertOnNewLine && !isBlockElement(insertedNode)) {
                wrap(insertedNode);
            }

            break;
        case ContentPosition.Range:
        case ContentPosition.SelectionStart:
            let { range, rangeToRestore } = getInitialRange(core, option);

            if (!range) {
                return;
            }

            // if to replace the selection and the selection is not collapsed, remove the the content at selection first
            if (option.replaceSelection && !range.collapsed) {
                range.deleteContents();
            }

            let pos = Position.getStart(range);
            let blockElement: BlockElement;

            if (
                option.insertOnNewLine &&
                (blockElement = getBlockElementAtNode(contentDiv, pos.normalize().node))
            ) {
                pos = new Position(blockElement.getEndNode(), PositionType.After);
            } else {
                pos = adjustNodeInsertPosition(contentDiv, node, pos);
            }

            let nodeForCursor = node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
            range = createRange(pos);
            range.insertNode(node);
            if (option.updateCursor && nodeForCursor) {
                rangeToRestore = createRange(
                    new Position(nodeForCursor, PositionType.After).normalize()
                );
            }
            core.api.selectRange(core, rangeToRestore);

            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, contentDiv.nextSibling);
            break;
    }

    return true;
};

export default insertNode;
