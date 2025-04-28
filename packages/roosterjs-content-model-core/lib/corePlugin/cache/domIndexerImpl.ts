import {
    EmptySegmentFormat,
    addCode,
    addLink,
    createParagraph,
    createSelectionMarker,
    createText,
    getObjectKeys,
    isElementOfType,
    isEntityDelimiter,
    isNodeOfType,
    setSelection,
} from 'roosterjs-content-model-dom';
import type {
    CacheSelection,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelText,
    DomIndexer,
    DOMSelection,
    RangeSelectionForCache,
    Selectable,
} from 'roosterjs-content-model-types';

/**
 * @internal Export for test only
 */
export interface SegmentItem {
    paragraph: ContentModelParagraph;
    segments: ContentModelSegment[];
}

/**
 * @internal Export for test only
 */
export interface TableItem {
    table: ContentModelTable;
}

/**
 * @internal Export for test only
 */
export interface BlockEntityDelimiterItem {
    entity: ContentModelEntity;
    parent: ContentModelBlockGroup;
}

/**
 * @internal Export for test only
 */
export interface IndexedSegmentNode extends Node {
    __roosterjsContentModel: SegmentItem;
}

/**
 * @internal Export for test only
 */
export interface IndexedTableElement extends HTMLTableElement {
    __roosterjsContentModel: TableItem;
}

/**
 * @internal Export for test only
 */
export interface IndexedEntityDelimiter extends Text {
    __roosterjsContentModel: BlockEntityDelimiterItem;
}

/**
 * Context object used by DomIndexer when reconcile mutations with child list
 */
interface ReconcileChildListContext {
    /**
     * Index of segment in current paragraph
     */
    segIndex: number;

    /**
     * The current paragraph that we are handling
     */
    paragraph?: ContentModelParagraph;

    /**
     * Text node that is added from mutation but has not been handled. This can happen when we first see an added node then later we see a removed one.
     * e.g. Type text in an empty paragraph (&lt;div&gt;&lt;br&gt;&lt;/div&gt;), so a text node will be added and &lt;BR&gt; will be removed.
     * Set to a valid text node means we need to handle it later. If it is finally not handled, that means we need to clear cache
     * Set to undefined (initial value) means no pending text node is hit yet (valid case)
     * Set to null means there was a pending text node which is already handled, so if we see another pending text node,
     * we should clear cache since we don't know how to handle it
     */
    pendingTextNode?: Text | null;

    /**
     * Format of the removed segment, this will be used as the format for newly created segment
     */
    format?: ContentModelSegmentFormat;
}

function isIndexedSegment(node: Node): node is IndexedSegmentNode {
    const { paragraph, segments } = (node as IndexedSegmentNode).__roosterjsContentModel ?? {};

    return (
        paragraph &&
        paragraph.blockType == 'Paragraph' &&
        Array.isArray(paragraph.segments) &&
        Array.isArray(segments) &&
        segments.every(segment => paragraph.segments.includes(segment))
    );
}

function isIndexedDelimiter(node: Node): node is IndexedEntityDelimiter {
    const { entity, parent } = (node as IndexedEntityDelimiter).__roosterjsContentModel ?? {};

    return (
        entity?.blockType == 'Entity' &&
        entity.wrapper &&
        parent?.blockGroupType &&
        Array.isArray(parent.blocks)
    );
}

function getIndexedSegmentItem(node: Node | null): SegmentItem | null {
    return node && isIndexedSegment(node) ? node.__roosterjsContentModel : null;
}

function getIndexedTableItem(element: HTMLTableElement): TableItem | null {
    const index = (element as IndexedTableElement).__roosterjsContentModel;
    const table = index?.table;

    if (
        table?.blockType == 'Table' &&
        Array.isArray(table.rows) &&
        table.rows.every(
            x => Array.isArray(x?.cells) && x.cells.every(y => y?.blockGroupType == 'TableCell')
        )
    ) {
        return index;
    } else {
        return null;
    }
}

// Make a node not indexed. Do not export this function since we should not let code outside here know this detail
function unindex(node: Partial<IndexedSegmentNode>) {
    delete node.__roosterjsContentModel;
}

/**
 * @internal
 * Implementation of DomIndexer
 */
export class DomIndexerImpl implements DomIndexer {
    constructor(private readonly persistCache?: boolean) {}

    onSegment(segmentNode: Node, paragraph: ContentModelParagraph, segment: ContentModelSegment[]) {
        const indexedText = segmentNode as IndexedSegmentNode;
        indexedText.__roosterjsContentModel = {
            paragraph,
            segments: segment,
        };
    }

    onParagraph(paragraphElement: HTMLElement) {
        let previousText: Text | null = null;

        for (let child = paragraphElement.firstChild; child; child = child.nextSibling) {
            if (isNodeOfType(child, 'TEXT_NODE')) {
                if (!previousText) {
                    previousText = child;
                } else {
                    const item = getIndexedSegmentItem(previousText);

                    if (item && isIndexedSegment(child)) {
                        item.segments = item.segments.concat(
                            child.__roosterjsContentModel.segments
                        );
                        child.__roosterjsContentModel.segments = [];
                    }
                }
            } else if (isNodeOfType(child, 'ELEMENT_NODE')) {
                previousText = null;

                this.onParagraph(child);
            } else {
                previousText = null;
            }
        }
    }

    onTable(tableElement: HTMLTableElement, table: ContentModelTable) {
        const indexedTable = tableElement as IndexedTableElement;
        indexedTable.__roosterjsContentModel = { table };
    }

    onBlockEntity(entity: ContentModelEntity, group: ContentModelBlockGroup) {
        this.onBlockEntityDelimiter(entity.wrapper.previousSibling, entity, group);
        this.onBlockEntityDelimiter(entity.wrapper.nextSibling, entity, group);
    }

    onMergeText(targetText: Text, sourceText: Text) {
        if (isIndexedSegment(targetText) && isIndexedSegment(sourceText)) {
            if (targetText.nextSibling == sourceText) {
                targetText.__roosterjsContentModel.segments.push(
                    ...sourceText.__roosterjsContentModel.segments
                );

                unindex(sourceText);
            }
        } else {
            unindex(sourceText);
            unindex(targetText);
        }
    }

    reconcileSelection(
        model: ContentModelDocument,
        newSelection: DOMSelection,
        oldSelection?: CacheSelection
    ): boolean {
        if (oldSelection) {
            let startNode: Node | undefined;

            if (
                oldSelection.type == 'range' &&
                this.isCollapsed(oldSelection) &&
                (startNode = oldSelection.start.node) &&
                isNodeOfType(startNode, 'TEXT_NODE') &&
                isIndexedSegment(startNode) &&
                startNode.__roosterjsContentModel.segments.length > 0
            ) {
                this.reconcileTextSelection(startNode);
            } else {
                setSelection(model);
            }
        }

        switch (newSelection.type) {
            case 'image':
                const indexedImage = getIndexedSegmentItem(newSelection.image);
                const image = indexedImage?.segments[0];

                if (image) {
                    image.isSelected = true;
                    setSelection(model, image);

                    return true;
                } else {
                    return false;
                }

            case 'table':
                const indexedTable = getIndexedTableItem(newSelection.table);

                if (indexedTable) {
                    const firstCell =
                        indexedTable.table.rows[newSelection.firstRow]?.cells[
                            newSelection.firstColumn
                        ];
                    const lastCell =
                        indexedTable.table.rows[newSelection.lastRow]?.cells[
                            newSelection.lastColumn
                        ];

                    if (firstCell && lastCell) {
                        setSelection(model, firstCell, lastCell);

                        return true;
                    }
                }

                return false;

            case 'range':
                const newRange = newSelection.range;
                if (newRange) {
                    const {
                        startContainer,
                        startOffset,
                        endContainer,
                        endOffset,
                        collapsed,
                    } = newRange;

                    delete model.hasRevertedRangeSelection;

                    if (collapsed) {
                        return !!this.reconcileNodeSelection(
                            startContainer,
                            startOffset,
                            model.format
                        );
                    } else if (
                        startContainer == endContainer &&
                        isNodeOfType(startContainer, 'TEXT_NODE')
                    ) {
                        if (newSelection.isReverted) {
                            model.hasRevertedRangeSelection = true;
                        }

                        return (
                            isIndexedSegment(startContainer) &&
                            !!this.reconcileTextSelection(startContainer, startOffset, endOffset)
                        );
                    } else {
                        const marker1 = this.reconcileNodeSelection(startContainer, startOffset);
                        const marker2 = this.reconcileNodeSelection(endContainer, endOffset);

                        if (marker1 && marker2) {
                            if (newSelection.isReverted) {
                                model.hasRevertedRangeSelection = true;
                            }

                            setSelection(model, marker1, marker2);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                break;
        }

        return false;
    }

    reconcileChildList(addedNodes: ArrayLike<Node>, removedNodes: ArrayLike<Node>): boolean {
        if (!this.persistCache) {
            return false;
        }

        let canHandle = true;
        const context: ReconcileChildListContext = {
            segIndex: -1,
        };

        // First process added nodes
        const addedNode = addedNodes[0];

        if (addedNodes.length == 1 && isNodeOfType(addedNode, 'TEXT_NODE')) {
            canHandle = this.reconcileAddedNode(addedNode, context);
        } else if (addedNodes.length > 0) {
            canHandle = false;
        }

        // Second, process removed nodes
        const removedNode = removedNodes[0];

        if (canHandle && removedNodes.length == 1) {
            canHandle = this.reconcileRemovedNode(removedNode, context);
        } else if (removedNodes.length > 0) {
            canHandle = false;
        }

        return canHandle && !context.pendingTextNode;
    }

    reconcileElementId(element: HTMLElement) {
        if (isElementOfType(element, 'img')) {
            const indexedImg = getIndexedSegmentItem(element);

            if (indexedImg?.segments[0]?.segmentType == 'Image') {
                indexedImg.segments[0].format.id = element.id;

                return true;
            } else {
                return false;
            }
        } else if (isElementOfType(element, 'table')) {
            const indexedTable = getIndexedTableItem(element);

            if (indexedTable) {
                indexedTable.table.format.id = element.id;

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private onBlockEntityDelimiter(
        node: Node | null,
        entity: ContentModelEntity,
        parent: ContentModelBlockGroup
    ) {
        if (isNodeOfType(node, 'ELEMENT_NODE') && isEntityDelimiter(node) && node.firstChild) {
            const indexedDelimiter = node.firstChild as IndexedEntityDelimiter;

            indexedDelimiter.__roosterjsContentModel = { entity, parent };
        }
    }

    private isCollapsed(selection: RangeSelectionForCache): boolean {
        const { start, end } = selection;

        return start.node == end.node && start.offset == end.offset;
    }

    private reconcileNodeSelection(
        node: Node,
        offset: number,
        defaultFormat?: ContentModelSegmentFormat
    ): Selectable | undefined {
        if (isNodeOfType(node, 'TEXT_NODE')) {
            if (isIndexedSegment(node)) {
                return this.reconcileTextSelection(node, offset);
            } else if (isIndexedDelimiter(node)) {
                return this.reconcileDelimiterSelection(node, defaultFormat);
            } else {
                return undefined;
            }
        } else if (offset >= node.childNodes.length) {
            return this.insertMarker(node.lastChild, true /*isAfter*/);
        } else {
            return this.insertMarker(node.childNodes[offset], false /*isAfter*/);
        }
    }

    private insertMarker(node: Node | null, isAfter: boolean): Selectable | undefined {
        let marker: ContentModelSelectionMarker | undefined;
        const segmentItem = node && getIndexedSegmentItem(node);

        if (segmentItem) {
            const { paragraph, segments } = segmentItem;
            const index = paragraph.segments.indexOf(segments[0]);

            if (index >= 0) {
                const formatSegment =
                    (!isAfter && paragraph.segments[index - 1]) || paragraph.segments[index];
                marker = createSelectionMarker(formatSegment.format);

                paragraph.segments.splice(isAfter ? index + 1 : index, 0, marker);
            }
        }

        return marker;
    }

    private reconcileTextSelection(
        textNode: IndexedSegmentNode,
        startOffset?: number,
        endOffset?: number
    ) {
        const { paragraph, segments } = textNode.__roosterjsContentModel;
        const first = segments[0];
        const last = segments[segments.length - 1];
        let selectable: Selectable | undefined;

        if (first?.segmentType == 'Text' && last?.segmentType == 'Text') {
            const newSegments: ContentModelSegment[] = [];
            const txt = textNode.nodeValue || '';
            const textSegments: ContentModelText[] = [];

            if (startOffset === undefined) {
                first.text = txt;
                newSegments.push(first);
                textSegments.push(first);
            } else {
                if (startOffset > 0) {
                    first.text = txt.substring(0, startOffset);
                    newSegments.push(first);
                    textSegments.push(first);
                }

                if (endOffset === undefined) {
                    const marker = createSelectionMarker(first.format);
                    newSegments.push(marker);

                    if (startOffset < (textNode.nodeValue ?? '').length) {
                        if (first.link) {
                            addLink(marker, first.link);
                        }

                        if (first.code) {
                            addCode(marker, first.code);
                        }
                    }

                    selectable = marker;
                    endOffset = startOffset;
                } else if (endOffset > startOffset) {
                    const middle = createText(
                        txt.substring(startOffset, endOffset),
                        first.format,
                        first.link,
                        first.code
                    );

                    middle.isSelected = true;
                    newSegments.push(middle);
                    textSegments.push(middle);
                    selectable = middle;
                }

                if (endOffset < txt.length) {
                    const newLast = createText(
                        txt.substring(endOffset),
                        first.format,
                        first.link,
                        first.code
                    );
                    newSegments.push(newLast);
                    textSegments.push(newLast);
                }
            }

            let firstIndex = paragraph.segments.indexOf(first);
            let lastIndex = paragraph.segments.indexOf(last);

            if (firstIndex >= 0 && lastIndex >= 0) {
                while (
                    firstIndex > 0 &&
                    paragraph.segments[firstIndex - 1].segmentType == 'SelectionMarker'
                ) {
                    firstIndex--;
                }

                while (
                    lastIndex < paragraph.segments.length - 1 &&
                    paragraph.segments[lastIndex + 1].segmentType == 'SelectionMarker'
                ) {
                    lastIndex++;
                }

                paragraph.segments.splice(firstIndex, lastIndex - firstIndex + 1, ...newSegments);
            }

            this.onSegment(textNode, paragraph, textSegments);

            if (!this.persistCache) {
                delete paragraph.cachedElement;
            }
        } else if (first?.segmentType == 'Entity' && first == last) {
            const wrapper = first.wrapper;
            const index = paragraph.segments.indexOf(first);
            const delimiter = textNode.parentElement;
            const isBefore = wrapper.previousSibling == delimiter;
            const isAfter = wrapper.nextSibling == delimiter;

            if (index >= 0 && delimiter && isEntityDelimiter(delimiter) && (isBefore || isAfter)) {
                const marker = createSelectionMarker(
                    (paragraph.segments[isAfter ? index + 1 : index - 1] ?? first).format
                );

                paragraph.segments.splice(isAfter ? index + 1 : index, 0, marker);

                selectable = marker;
            }
        }

        return selectable;
    }

    private reconcileDelimiterSelection(
        node: IndexedEntityDelimiter,
        defaultFormat?: ContentModelSegmentFormat
    ) {
        let marker: ContentModelSelectionMarker | undefined;

        const { entity, parent } = node.__roosterjsContentModel;
        const index = parent.blocks.indexOf(entity);
        const delimiter = node.parentElement;
        const wrapper = entity.wrapper;
        const isBefore = wrapper.previousSibling == delimiter;
        const isAfter = wrapper.nextSibling == delimiter;

        if (index >= 0 && delimiter && isEntityDelimiter(delimiter) && (isBefore || isAfter)) {
            marker = createSelectionMarker(defaultFormat);

            const para = createParagraph(
                true /*isImplicit*/,
                undefined /*blockFormat*/,
                defaultFormat
            );

            para.segments.push(marker);
            parent.blocks.splice(isBefore ? index : index + 1, 0, para);
        }

        return marker;
    }

    private reconcileAddedNode(node: Text, context: ReconcileChildListContext): boolean {
        let segmentItem: SegmentItem | null = null;
        let index = -1;
        let existingSegment: ContentModelSegment;
        const { previousSibling, nextSibling } = node;

        if (
            (segmentItem = getIndexedSegmentItem(getLastLeaf(previousSibling))) &&
            (existingSegment = segmentItem.segments[segmentItem.segments.length - 1]) &&
            (index = segmentItem.paragraph.segments.indexOf(existingSegment)) >= 0
        ) {
            // When we can find indexed segment before current one, use it as the insert index
            this.indexNode(segmentItem.paragraph, index + 1, node, existingSegment.format);
        } else if (
            (segmentItem = getIndexedSegmentItem(getFirstLeaf(nextSibling))) &&
            (existingSegment = segmentItem.segments[0]) &&
            (index = segmentItem.paragraph.segments.indexOf(existingSegment)) >= 0
        ) {
            // When we can find indexed segment after current one, use it as the insert index
            this.indexNode(segmentItem.paragraph, index, node, existingSegment.format);
        } else if (context.paragraph && context.segIndex >= 0) {
            // When there is indexed paragraph from removed nodes, we can use it as the insert index
            this.indexNode(context.paragraph, context.segIndex, node, context.format);
        } else if (context.pendingTextNode === undefined) {
            // When we can't find the insert index, set current node as pending node
            // so later we can pick it up when we have enough info when processing removed node
            // Only do this when pendingTextNode is undefined. If it is null it means there was already a pending node before
            // and in that case we should return false since we can't handle two pending text node
            context.pendingTextNode = node;
        } else {
            return false;
        }

        return true;
    }

    private reconcileRemovedNode(node: Node, context: ReconcileChildListContext): boolean {
        let segmentItem: SegmentItem | null = null;
        let removingSegment: ContentModelSegment;

        if (
            context.segIndex < 0 &&
            !context.paragraph && // No previous removed segment or related paragraph found, and
            (segmentItem = getIndexedSegmentItem(node)) && // The removed node is indexed, and
            (removingSegment = segmentItem.segments[0]) // There is at least one related segment
        ) {
            // Now we can remove the indexed segment from the paragraph, and remember it, later we may need to use it
            context.format = removingSegment.format;
            context.paragraph = segmentItem.paragraph;
            context.segIndex = segmentItem.paragraph.segments.indexOf(segmentItem.segments[0]);

            if (context.segIndex < 0) {
                // Indexed segment is not under paragraph, something wrong happens, we cannot keep handling
                return false;
            }

            for (let i = 0; i < segmentItem.segments.length; i++) {
                const index = segmentItem.paragraph.segments.indexOf(segmentItem.segments[i]);

                if (index >= 0) {
                    segmentItem.paragraph.segments.splice(index, 1);
                }
            }

            if (context.pendingTextNode) {
                // If we have pending text node added but not indexed, do it now
                this.indexNode(
                    context.paragraph,
                    context.segIndex,
                    context.pendingTextNode,
                    segmentItem.segments[0].format
                );

                // Set to null since we have processed it.
                // Next time we see a pending node we know we have already processed one so it is a situation we cannot handle
                context.pendingTextNode = null;
            }

            return true;
        } else {
            return false;
        }
    }

    private indexNode(
        paragraph: ContentModelParagraph,
        index: number,
        textNode: Text,
        format?: ContentModelSegmentFormat
    ) {
        const copiedFormat = format ? { ...format } : undefined;

        if (copiedFormat) {
            getObjectKeys(copiedFormat).forEach(key => {
                if (EmptySegmentFormat[key] === undefined) {
                    delete copiedFormat[key];
                }
            });
        }

        const text = createText(textNode.textContent ?? '', copiedFormat);

        paragraph.segments.splice(index, 0, text);
        this.onSegment(textNode, paragraph, [text]);
    }
}

function getLastLeaf(node: Node | null): Node | null {
    while (node?.lastChild) {
        node = node.lastChild;
    }

    return node;
}

function getFirstLeaf(node: Node | null): Node | null {
    while (node?.firstChild) {
        node = node.firstChild;
    }

    return node;
}
