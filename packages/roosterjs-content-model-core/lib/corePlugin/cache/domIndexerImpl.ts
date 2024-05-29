import { EmptySegmentFormat } from './EmptySegmentFormat';
import {
    createSelectionMarker,
    createText,
    getObjectKeys,
    isNodeOfType,
    setSelection,
} from 'roosterjs-content-model-dom';
import type {
    CacheSelection,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableRow,
    ContentModelText,
    DomIndexer,
    DOMSelection,
    RangeSelectionForCache,
    ReconcileChildListContext,
    Selectable,
} from 'roosterjs-content-model-types';

interface SegmentItem {
    paragraph: ContentModelParagraph;
    segments: ContentModelSegment[];
}

interface TableItem {
    tableRows: ContentModelTableRow[];
}

interface IndexedSegmentNode extends Node {
    __roosterjsContentModel: SegmentItem;
}

interface IndexedTableElement extends HTMLTableElement {
    __roosterjsContentModel: TableItem;
}

function isIndexedSegment(node: Node): node is IndexedSegmentNode {
    const { paragraph, segments } = (node as IndexedSegmentNode).__roosterjsContentModel ?? {};

    return (
        paragraph &&
        paragraph.blockType == 'Paragraph' &&
        Array.isArray(paragraph.segments) &&
        Array.isArray(segments)
    );
}

function getIndexedSegmentItem(node: Node | null): SegmentItem | null {
    return node && isIndexedSegment(node) ? node.__roosterjsContentModel : null;
}

function onSegment(
    segmentNode: Node,
    paragraph: ContentModelParagraph,
    segment: ContentModelSegment[]
) {
    const indexedText = segmentNode as IndexedSegmentNode;
    indexedText.__roosterjsContentModel = {
        paragraph,
        segments: segment,
    };
}

function onParagraph(paragraphElement: HTMLElement) {
    let previousText: Text | null = null;

    for (let child = paragraphElement.firstChild; child; child = child.nextSibling) {
        if (isNodeOfType(child, 'TEXT_NODE')) {
            if (!previousText) {
                previousText = child;
            } else {
                const item = getIndexedSegmentItem(previousText);

                if (item && isIndexedSegment(child)) {
                    item.segments = item.segments.concat(child.__roosterjsContentModel.segments);
                    child.__roosterjsContentModel.segments = [];
                }
            }
        } else if (isNodeOfType(child, 'ELEMENT_NODE')) {
            previousText = null;

            onParagraph(child);
        } else {
            previousText = null;
        }
    }
}

function onTable(tableElement: HTMLTableElement, table: ContentModelTable) {
    const indexedTable = tableElement as IndexedTableElement;
    indexedTable.__roosterjsContentModel = { tableRows: table.rows };
}

function reconcileSelection(
    model: ContentModelDocument,
    newSelection: DOMSelection,
    oldSelection?: CacheSelection
): boolean {
    if (oldSelection) {
        if (
            oldSelection.type == 'range' &&
            isCollapsed(oldSelection) &&
            isNodeOfType(oldSelection.start.node, 'TEXT_NODE')
        ) {
            if (isIndexedSegment(oldSelection.start.node)) {
                reconcileTextSelection(oldSelection.start.node);
            }
        } else {
            setSelection(model);
        }
    }

    switch (newSelection.type) {
        case 'image':
        case 'table':
            // For image and table selection, we just clear the cached model since during selecting the element id might be changed
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
                    return !!reconcileNodeSelection(startContainer, startOffset);
                } else if (
                    startContainer == endContainer &&
                    isNodeOfType(startContainer, 'TEXT_NODE')
                ) {
                    if (newSelection.isReverted) {
                        model.hasRevertedRangeSelection = true;
                    }

                    return (
                        isIndexedSegment(startContainer) &&
                        !!reconcileTextSelection(startContainer, startOffset, endOffset)
                    );
                } else {
                    const marker1 = reconcileNodeSelection(startContainer, startOffset);
                    const marker2 = reconcileNodeSelection(endContainer, endOffset);

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

function isCollapsed(selection: RangeSelectionForCache): boolean {
    const { start, end } = selection;

    return start.node == end.node && start.offset == end.offset;
}

function reconcileNodeSelection(node: Node, offset: number): Selectable | undefined {
    if (isNodeOfType(node, 'TEXT_NODE')) {
        return isIndexedSegment(node) ? reconcileTextSelection(node, offset) : undefined;
    } else if (offset >= node.childNodes.length) {
        return insertMarker(node.lastChild, true /*isAfter*/);
    } else {
        return insertMarker(node.childNodes[offset], false /*isAfter*/);
    }
}

function insertMarker(node: Node | null, isAfter: boolean): Selectable | undefined {
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

function reconcileTextSelection(
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

        onSegment(textNode, paragraph, textSegments);

        delete paragraph.cachedElement;
    }

    return selectable;
}

function reconcileChildList(
    addedNodes: ArrayLike<Node>,
    removedNodes: ArrayLike<Node>,
    context: ReconcileChildListContext
): boolean {
    let canHandle = true;

    // First process added nodes
    const addedNode = addedNodes[0];

    if (addedNodes.length == 1 && isNodeOfType(addedNode, 'TEXT_NODE')) {
        canHandle = reconcileAddedNode(addedNode, context);
    } else if (addedNodes.length > 0) {
        canHandle = false;
    }

    // Second, process removed nodes
    const removedNode = removedNodes[0];

    if (canHandle && removedNodes.length == 1) {
        canHandle = reconcileRemovedNode(removedNode, context);
    } else if (removedNodes.length > 0) {
        canHandle = false;
    }

    return canHandle;
}

function reconcileAddedNode(node: Text, context: ReconcileChildListContext): boolean {
    let segmentItem: SegmentItem | null = null;
    let index = -1;
    let existingSegment: ContentModelSegment;
    const { previousSibling, nextSibling } = node;

    if (
        (segmentItem = getIndexedSegmentItem(previousSibling)) &&
        (existingSegment = segmentItem.segments[segmentItem.segments.length - 1]) &&
        (index = segmentItem.paragraph.segments.indexOf(existingSegment)) >= 0
    ) {
        // When we can find indexed segment before current one, use it as the insert index
        indexNode(segmentItem.paragraph, index + 1, node, existingSegment.format);
    } else if (
        (segmentItem = getIndexedSegmentItem(nextSibling)) &&
        (existingSegment = segmentItem.segments[0]) &&
        (index = segmentItem.paragraph.segments.indexOf(existingSegment)) >= 0
    ) {
        // When we can find indexed segment after current one, use it as the insert index
        indexNode(segmentItem.paragraph, index, node, existingSegment.format);
    } else if (context.paragraph && context.segIndex >= 0) {
        // When there is indexed paragraph from removed nodes, we can use it as the insert index
        indexNode(context.paragraph, context.segIndex, node, context.format);
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

function reconcileRemovedNode(node: Node, context: ReconcileChildListContext): boolean {
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

        for (let i = 0; i < segmentItem.segments.length; i++) {
            const index = segmentItem.paragraph.segments.indexOf(segmentItem.segments[i]);

            if (index >= 0) {
                segmentItem.paragraph.segments.splice(index, 1);
            }
        }

        if (context.pendingTextNode) {
            // If we have pending text node added but not indexed, do it now
            indexNode(
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

function indexNode(
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
    onSegment(textNode, paragraph, [text]);
}

/**
 * @internal
 * Implementation of DomIndexer
 */
export const domIndexerImpl: DomIndexer = {
    onSegment,
    onParagraph,
    onTable,
    reconcileSelection,
    reconcileChildList,
};
