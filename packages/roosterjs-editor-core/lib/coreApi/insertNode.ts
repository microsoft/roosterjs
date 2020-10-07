import {
    BlockElement,
    ContentPosition,
    ColorTransformDirection,
    EditorCore,
    InsertNode,
    InsertOption,
    NodeType,
    NodePosition,
    PositionType,
    QueryScope,
} from 'roosterjs-editor-types';
import {
    changeElementTag,
    contains,
    createRange,
    findClosestElementAncestor,
    getBlockElementAtNode,
    getFirstLastBlockElement,
    getTagOfNode,
    isBlockElement,
    isNodeEmpty,
    isPositionAtBeginningOf,
    isVoidHtmlElement,
    Position,
    queryElements,
    safeInstanceOf,
    splitBalancedNodeRange,
    splitTextNode,
    toArray,
    unwrap,
    VTable,
    wrap,
} from 'roosterjs-editor-dom';

const adjustSteps: ((
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
) => NodePosition)[] = [handleHyperLink, handleStructuredNode, handleParagraph, handleVoidElement];

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

/**
 * @internal
 * Insert a DOM node into editor content
 * @param core The EditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export const insertNode: InsertNode = (core: EditorCore, node: Node, option: InsertOption) => {
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

    if (option.position == ContentPosition.Outside) {
        contentDiv.parentNode.insertBefore(node, contentDiv.nextSibling);
        return true;
    }

    core.api.transformColor(
        core,
        node,
        true /*includeSelf*/,
        () => {
            switch (option.position) {
                case ContentPosition.Begin:
                case ContentPosition.End: {
                    let isBegin = option.position == ContentPosition.Begin;
                    let block = getFirstLastBlockElement(contentDiv, isBegin);
                    let insertedNode: Node | Node[];
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
                                refNode.parentNode.insertBefore(
                                    node,
                                    isBegin ? refNode : refNode.nextSibling
                                );
                            } else {
                                insertedNode = refNode.parentNode.insertBefore(
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

                    let pos = Position.getStart(range);
                    let blockElement: BlockElement;

                    if (
                        option.insertOnNewLine &&
                        (blockElement = getBlockElementAtNode(contentDiv, pos.normalize().node))
                    ) {
                        pos = new Position(blockElement.getEndNode(), PositionType.After);
                    } else {
                        adjustSteps.forEach(handler => {
                            pos = handler(contentDiv, node, pos);
                        });
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
                    core.api.selectRange(core, rangeToRestore);

                    break;
            }
        },
        ColorTransformDirection.LightToDark
    );

    return true;
};

function handleHyperLink(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    let blockElement = getBlockElementAtNode(root, position.node);

    if (blockElement) {
        // Find the first <A> tag within current block which covers current selection
        // If there are more than one nested, let's handle the first one only since that is not a common scenario.
        let anchor = queryElements(
            root,
            'a[href]',
            null /*forEachCallback*/,
            QueryScope.OnSelection,
            createRange(position)
        ).filter(a => blockElement.contains(a))[0];

        // If this is about to insert node to an empty A tag, clear the A tag and reset position
        if (anchor && isNodeEmpty(anchor)) {
            position = new Position(anchor, PositionType.Before);
            safeRemove(anchor);
            anchor = null;
        }

        // If this is about to insert nodes which contains A tag into another A tag, need to break current A tag
        // otherwise we will have nested A tags which is a wrong HTML structure
        if (
            anchor &&
            (<ParentNode>(<any>nodeToInsert)).querySelector &&
            (<ParentNode>(<any>nodeToInsert)).querySelector('a[href]')
        ) {
            let normalizedPosition = position.normalize();
            let parentNode = normalizedPosition.node.parentNode;
            let nextNode =
                normalizedPosition.node.nodeType == NodeType.Text
                    ? splitTextNode(
                          <Text>normalizedPosition.node,
                          normalizedPosition.offset,
                          false /*returnFirstPart*/
                      )
                    : normalizedPosition.isAtEnd
                    ? normalizedPosition.node.nextSibling
                    : normalizedPosition.node;
            let splitter: Node = root.ownerDocument.createTextNode('');
            parentNode.insertBefore(splitter, nextNode);

            while (contains(anchor, splitter)) {
                splitter = splitBalancedNodeRange(splitter);
            }

            position = new Position(splitter, PositionType.Before);
            safeRemove(splitter);
        }
    }

    return position;
}

function handleStructuredNode(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    let rootNodeToInsert = nodeToInsert;

    if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
        let rootNodes = toArray(rootNodeToInsert.childNodes).filter(n => getTagOfNode(n) != 'BR');
        rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
    }

    let tag = getTagOfNode(rootNodeToInsert);
    let hasBrNextToRoot = tag && getTagOfNode(rootNodeToInsert.nextSibling) == 'BR';
    let listItem = findClosestElementAncestor(position.node, root, 'LI');
    let listNode = listItem && findClosestElementAncestor(listItem, root, 'OL,UL');
    let tdNode = findClosestElementAncestor(position.node, root, 'TD,TH');
    let trNode = tdNode && findClosestElementAncestor(tdNode, root, 'TR');

    if (tag == 'LI') {
        tag = listNode ? getTagOfNode(listNode) : 'UL';
        rootNodeToInsert = wrap(rootNodeToInsert, tag);
    }

    if ((tag == 'OL' || tag == 'UL') && getTagOfNode(rootNodeToInsert.firstChild) == 'LI') {
        let shouldInsertListAsText = !rootNodeToInsert.firstChild.nextSibling && !hasBrNextToRoot;

        if (hasBrNextToRoot && rootNodeToInsert.parentNode) {
            safeRemove(rootNodeToInsert.nextSibling);
        }

        if (shouldInsertListAsText) {
            unwrap(rootNodeToInsert.firstChild);
            unwrap(rootNodeToInsert);
        } else if (getTagOfNode(listNode) == tag) {
            unwrap(rootNodeToInsert);
            position = new Position(
                listItem,
                isPositionAtBeginningOf(position, listItem)
                    ? PositionType.Before
                    : PositionType.After
            );
        }
    } else if (tag == 'TABLE' && trNode) {
        // When inserting a table into a table, if these tables have the same column count, and
        // current position is at beginning of a row, then merge these two tables
        let newTable = new VTable(<HTMLTableElement>rootNodeToInsert);
        let currentTable = new VTable(<HTMLTableCellElement>tdNode);
        if (
            currentTable.col == 0 &&
            tdNode == currentTable.getCell(currentTable.row, 0).td &&
            newTable.cells[0] &&
            newTable.cells[0].length == currentTable.cells[0].length &&
            isPositionAtBeginningOf(position, tdNode)
        ) {
            if (
                getTagOfNode(rootNodeToInsert.firstChild) == 'TBODY' &&
                !rootNodeToInsert.firstChild.nextSibling
            ) {
                unwrap(rootNodeToInsert.firstChild);
            }
            unwrap(rootNodeToInsert);
            position = new Position(trNode, PositionType.After);
        }
    }

    return position;
}

function handleParagraph(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    if (getTagOfNode(position.node) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        let pos = position.normalize();
        let div = changeElementTag(<HTMLElement>position.node, 'div');
        if (pos.node != div) {
            position = pos;
        }
    }

    return position;
}

function handleVoidElement(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    if (isVoidHtmlElement(position.node)) {
        position = new Position(
            position.node,
            position.isAtEnd ? PositionType.After : PositionType.Before
        );
    }

    return position;
}

function safeRemove(node: Node) {
    node?.parentNode?.removeChild(node);
}
