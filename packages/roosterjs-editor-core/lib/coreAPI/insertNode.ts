import EditorCore from '../editor/EditorCore';
import focus from './focus';
import getLiveSelectionRange from './getLiveSelectionRange';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import updateSelection from './deprecated/updateSelection';
import {
    EditorSelection,
    getFirstBlockElement,
    getLastBlockElement,
    isBlockElement,
    wrap,
} from 'roosterjs-editor-dom';
import { ContentPosition, InsertOption, NodeType } from 'roosterjs-editor-types';

const HTML_EMPTY_DIV = '<div></div>';

export default function insertNode(core: EditorCore, node: Node, option?: InsertOption): boolean {
    option = option || {
        position: ContentPosition.SelectionStart,
        updateCursor: true,
        replaceSelection: true,
        insertOnNewLine: false,
    };

    if (option.updateCursor) {
        focus(core);
    }

    switch (option.position) {
        case ContentPosition.Begin:
            insertNodeAtBegin(core, node, option);
            break;
        case ContentPosition.End:
            insertNodeAtEnd(core, node, option);
            break;
        case ContentPosition.SelectionStart:
            insertNodeAtSelection(core, node, option);
            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, core.contentDiv.nextSibling);
            break;
    }

    return true;
}

// Insert a node at begin of the editor
function insertNodeAtBegin(core: EditorCore, node: Node, option: InsertOption) {
    let firstBlock = getFirstBlockElement(core.contentDiv, core.inlineElementFactory);
    let insertedNode: Node;
    if (firstBlock) {
        let refNode = firstBlock.getStartNode();
        let refParentNode = refNode.parentNode;
        if (option.insertOnNewLine) {
            // For insert on new line, insert it before the start of block
            insertedNode = refParentNode.insertBefore(node, refNode);
        } else {
            // not to insert on new line (to insert inline)
            // we shall try to insert the node in the block
            if (refNode.firstChild) {
                // if the refNode has firstChild, insert the new node before first child
                // i.e. <div>hello</div>, first child will be hello. We want to insert the content
                // before hello, but still within the DIV
                insertedNode = refNode.insertBefore(node, refNode.firstChild);
            } else if (
                refNode.nodeType == NodeType.Text ||
                isVoidHtmlElement(refNode as HTMLElement)
            ) {
                // refNode is text or void html element (HR, BR etc.) which cannot have children
                // i.e. <div>hello<br>world</div>, first block is hello<br>
                // we want to insert the node before hello, but still within the DIV
                insertedNode = refParentNode.insertBefore(node, refNode);
            } else {
                // refNode is element type. It does not have children, but can have children
                // i.e. empty block <div></div>
                // Use appendChild to append it into refNode
                insertedNode = refNode.appendChild(node);
            }
        }
    } else {
        // No first block, this can happen when editor is empty. Use appendChild to insert the content in contentDiv
        insertedNode = core.contentDiv.appendChild(node);
    }

    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !isBlockElement(insertedNode)) {
        wrap(insertedNode, HTML_EMPTY_DIV);
    }
}

// Insert a node at end of the editor
function insertNodeAtEnd(core: EditorCore, node: Node, option: InsertOption) {
    let lastBlock = getLastBlockElement(core.contentDiv, core.inlineElementFactory);
    let insertedNode: Node;
    if (lastBlock) {
        let refNode = lastBlock.getEndNode();
        let refParentNode = refNode.parentNode;
        if (option.insertOnNewLine) {
            // For insert on new line, insert it after the refNode (before refNode's next sibling)
            // The second param to insertBefore can be null, which means to insert at the end
            // refNode.nextSibling can be null, which ok and in that case, insertBefore behaves just like appendChild
            insertedNode = refParentNode.insertBefore(node, refNode.nextSibling);
        } else {
            // not to insert on new line (to insert inline)
            // the node needs to be inserted within the block
            if (refNode.lastChild) {
                // if the refNode has lastChild, use appendChild (which is like to insert as last child)
                // i.e. <div>hello</div>, the content will be inserted after hello
                insertedNode = refNode.appendChild(node);
            } else if (
                refNode.nodeType == NodeType.Text ||
                isVoidHtmlElement(refNode as HTMLElement)
            ) {
                // refNode is text or void html element (HR, BR etc.) which cannot have children
                // i.e. <div>hello<br>world</div>, world is the last block
                insertedNode = refParentNode.insertBefore(node, refNode.nextSibling);
            } else {
                // refNode is element type (other than void element), insert it as a child to refNode
                // i.e. <div></div>
                insertedNode = refNode.appendChild(node);
            }
        }
    } else {
        // No last block, editor is likely empty, use appendChild
        insertedNode = core.contentDiv.appendChild(node);
    }

    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !isBlockElement(insertedNode)) {
        wrap(insertedNode, HTML_EMPTY_DIV);
    }
}

// Insert node at selection
function insertNodeAtSelection(core: EditorCore, node: Node, option: InsertOption) {
    let selectionRange = getLiveSelectionRange(core) || core.cachedSelectionRange;
    if (selectionRange) {
        // if to replace the selection and the selection is not collapsed, remove the the content at selection first
        if (option.replaceSelection && !selectionRange.collapsed) {
            selectionRange.rawRange.deleteContents();
        }

        // Create a clone (backup) for the selection first as we may need to restore to it later
        let originalSelectionRange = selectionRange.rawRange.cloneRange();

        // Adjust the insertion point
        // option.insertOnNewLine means to insert on a block after the selection, not really right at the selection
        // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
        // and insert signature, they actually want signature to be inserted the line after the selection
        if (option.insertOnNewLine) {
            let editorSelection = new EditorSelection(
                core.contentDiv,
                selectionRange.rawRange,
                core.inlineElementFactory
            );
            let blockElement = editorSelection.startBlockElement;
            selectionRange.rawRange.setEndAfter(blockElement.getEndNode());
            selectionRange.rawRange.collapse(false /*toStart*/);
        }

        let nodeForCursor = node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
        selectionRange.rawRange.insertNode(node);
        if (option.updateCursor && nodeForCursor) {
            selectionRange.rawRange.setEndAfter(nodeForCursor);
            selectionRange.rawRange.collapse(false /*toStart*/);
            updateSelection(core, selectionRange.rawRange);
        } else {
            updateSelection(core, originalSelectionRange);
        }
    }
}
