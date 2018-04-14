import EditorCore from '../editor/EditorCore';
import focus from './focus';
import getLiveRange from './getLiveRange';
import select from './select';
import {
    SelectionRange,
    changeElementTag,
    contains,
    getBlockElementAtNode,
    getLeafNode,
    getTagOfNode,
    isBlockElement,
    isVoidHtmlElement,
    wrap,
} from 'roosterjs-editor-dom';
import { ContentPosition, InsertOption, NodeType, PositionType } from 'roosterjs-editor-types';

const HTML_EMPTY_DIV = '<div></div>';

export default function insertNode(core: EditorCore, node: Node, option?: InsertOption): boolean {
    let position = option ? option.position : ContentPosition.SelectionStart;
    let updateCursor = option ? option.updateCursor : true;
    let replaceSelection = option ? option.replaceSelection : true;
    let insertOnNewLine = option ? option.insertOnNewLine : false;

    if (updateCursor) {
        focus(core);
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
            let rawRange = getLiveRange(core) || core.cachedRange;
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
                        if (getTagOfNode(endNode) == 'P') {
                            // Insert into a P tag may cause issues when the inserted content contains any block element.
                            // Change P tag to DIV to make sure it works well
                            let rangeCache = new SelectionRange(rawRange).normalize();
                            let div = changeElementTag(endNode as HTMLElement, 'div');
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
                }

                let nodeForCursor =
                    node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;
                rawRange.insertNode(node);

                if (updateCursor && nodeForCursor) {
                    select(core, nodeForCursor, PositionType.After);
                } else {
                    select(core, clonedRange);
                }
            }
            break;
        case ContentPosition.Outside:
            core.contentDiv.parentNode.insertBefore(node, core.contentDiv.nextSibling);
            break;
    }

    return true;
}
