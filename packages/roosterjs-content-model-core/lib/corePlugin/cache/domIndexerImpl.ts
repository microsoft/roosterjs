import {
    createSelectionMarker,
    createText,
    isNodeOfType,
    setSelection,
} from 'roosterjs-content-model-dom';
import type {
    CacheSelection,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableRow,
    ContentModelText,
    DomIndexer,
    DOMSelection,
    RangeSelectionForCache,
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
                const item = isIndexedSegment(previousText)
                    ? previousText.__roosterjsContentModel
                    : undefined;

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

    if (node && isIndexedSegment(node)) {
        const { paragraph, segments } = node.__roosterjsContentModel;
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

/**
 * @internal
 * Implementation of DomIndexer
 */
export const domIndexerImpl: DomIndexer = {
    onSegment,
    onParagraph,
    onTable,
    reconcileSelection,
};
