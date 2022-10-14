import {
    BlockElement,
    ContentPosition,
    ColorTransformDirection,
    EditorCore,
    InsertNode,
    InsertOption,
    NodeType,
    PositionType,
    NodePosition,
    RegionType,
} from 'roosterjs-editor-types';
import {
    createRange,
    getBlockElementAtNode,
    getFirstLastBlockElement,
    isBlockElement,
    isVoidHtmlElement,
    Position,
    safeInstanceOf,
    toArray,
    wrap,
    adjustInsertPosition,
    getRegionsFromRange,
    splitTextNode,
    splitParentNode,
} from 'roosterjs-editor-dom';

function getInitialRange(
    core: EditorCore,
    option: InsertOption
): { range: Range | null; rangeToRestore: Range | null } {
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

/**
 * @internal
 * Insert a DOM node into editor content
 * @param core The EditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export const insertNode: InsertNode = (
    core: EditorCore,
    node: Node,
    option: InsertOption | null
) => {
    option = option || {
        position: ContentPosition.SelectionStart,
        insertOnNewLine: false,
        updateCursor: true,
        replaceSelection: true,
        insertToRegionRoot: false,
    };
    let contentDiv = core.contentDiv;

    if (option.updateCursor) {
        core.api.focus(core);
    }

    if (option.position == ContentPosition.Outside) {
        contentDiv.parentNode?.insertBefore(node, contentDiv.nextSibling);
        return true;
    }

    core.api.transformColor(
        core,
        node,
        true /*includeSelf*/,
        () => {
            if (!option) {
                return;
            }
            switch (option.position) {
                case ContentPosition.Begin:
                case ContentPosition.End: {
                    let isBegin = option.position == ContentPosition.Begin;
                    let block = getFirstLastBlockElement(contentDiv, isBegin);
                    let insertedNode: Node | Node[] | undefined;
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
                            if (safeInstanceOf(node, 'DocumentFragment')) {
                                // if the node to be inserted is DocumentFragment, use its childNodes as insertedNode
                                // because insertBefore() returns an empty DocumentFragment
                                insertedNode = toArray(node.childNodes);
                                refNode.parentNode?.insertBefore(
                                    node,
                                    isBegin ? refNode : refNode.nextSibling
                                );
                            } else {
                                insertedNode = refNode.parentNode?.insertBefore(
                                    node,
                                    isBegin ? refNode : refNode.nextSibling
                                );
                            }
                        } else {
                            // if the refNode can have child, use appendChild (which is like to insert as first/last child)
                            // i.e. <div>hello</div>, the content will be inserted before/after hello
                            insertedNode = refNode.insertBefore(
                                node,
                                isBegin ? refNode.firstChild : null
                            );
                        }
                    } else {
                        // No first block, this can happen when editor is empty. Use appendChild to insert the content in contentDiv
                        insertedNode = contentDiv.appendChild(node);
                    }

                    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
                    // add a DIV wrapping
                    if (insertedNode && option.insertOnNewLine) {
                        const nodes = Array.isArray(insertedNode) ? insertedNode : [insertedNode];
                        if (!isBlockElement(nodes[0]) || !isBlockElement(nodes[nodes.length - 1])) {
                            wrap(nodes);
                        }
                    }

                    break;
                }
                case ContentPosition.DomEnd:
                    // Use appendChild to insert the node at the end of the content div.
                    let insertedNode = contentDiv.appendChild(node);
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

                    let pos: NodePosition = Position.getStart(range);
                    let blockElement: BlockElement | null;

                    if (option.insertOnNewLine && option.insertToRegionRoot) {
                        pos = adjustInsertPositionRegionRoot(core, range, pos);
                    } else if (
                        option.insertOnNewLine &&
                        (blockElement = getBlockElementAtNode(contentDiv, pos.normalize().node))
                    ) {
                        pos = adjustInsertPositionNewLine(blockElement, core, pos);
                    } else {
                        pos = adjustInsertPosition(contentDiv, node, pos, range);
                    }

                    let nodeForCursor =
                        node.nodeType == NodeType.DocumentFragment ? node.lastChild : node;

                    range = createRange(pos);
                    range.insertNode(node);

                    if (option.updateCursor && nodeForCursor) {
                        rangeToRestore = createRange(
                            new Position(nodeForCursor, PositionType.After).normalize()
                        );
                    }

                    if (rangeToRestore) {
                        core.api.selectRange(core, rangeToRestore);
                    }

                    break;
            }
        },
        ColorTransformDirection.LightToDark
    );

    return true;
};

function adjustInsertPositionRegionRoot(core: EditorCore, range: Range, position: NodePosition) {
    const region = getRegionsFromRange(core.contentDiv, range, RegionType.Table)[0];
    let node: Node | null = position.node;

    if (region) {
        if (node.nodeType == NodeType.Text && !position.isAtEnd) {
            node = splitTextNode(node as Text, position.offset, true /*returnFirstPart*/);
        }

        if (node != region.rootNode) {
            while (node && node.parentNode != region.rootNode) {
                splitParentNode(node, false /*splitBefore*/);
                node = node.parentNode;
            }
        }

        if (node) {
            position = new Position(node, PositionType.After);
        }
    }

    return position;
}

function adjustInsertPositionNewLine(blockElement: BlockElement, core: EditorCore, pos: Position) {
    let tempPos = new Position(blockElement.getEndNode(), PositionType.After);
    if (safeInstanceOf(tempPos.node, 'HTMLTableRowElement')) {
        const div = core.contentDiv.ownerDocument.createElement('div');
        const range = createRange(pos);
        range.insertNode(div);
        tempPos = new Position(div, PositionType.Begin);
    }
    return tempPos;
}
