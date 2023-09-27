import { createSelectionMarker, createText, isNodeOfType } from 'roosterjs-content-model-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import { setSelection } from '../../modelApi/selection/setSelection';
import type { SelectionRangeEx, TableSelection } from 'roosterjs-editor-types';
import type {
    ContentModelDocument,
    ContentModelDomIndexer,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableRow,
    ContentModelText,
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

const UnSelectedCoordinates: TableSelection = {
    firstCell: {
        x: -1,
        y: -1,
    },
    lastCell: {
        x: -1,
        y: -1,
    },
};

function isIndexedSegment(node: Node): node is IndexedSegmentNode {
    const { paragraph, segments } = (node as IndexedSegmentNode).__roosterjsContentModel ?? {};

    return (
        paragraph &&
        paragraph.blockType == 'Paragraph' &&
        Array.isArray(paragraph.segments) &&
        Array.isArray(segments)
    );
}

function isIndexedTable(element: HTMLTableElement): element is IndexedTableElement {
    const { tableRows } = (element as IndexedTableElement).__roosterjsContentModel ?? {};

    return Array.isArray(tableRows) && tableRows.every(row => Array.isArray(row.cells));
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
    newRangeEx: SelectionRangeEx,
    oldRangeEx?: SelectionRangeEx
): boolean {
    if (oldRangeEx) {
        const range: Range | undefined = oldRangeEx.ranges[0];

        if (
            oldRangeEx?.type == SelectionRangeTypes.Normal &&
            range?.collapsed &&
            isNodeOfType(oldRangeEx.ranges[0].startContainer, 'TEXT_NODE')
        ) {
            if (isIndexedSegment(range.startContainer)) {
                reconcileTextSelection(range.startContainer);
            }
        } else {
            setSelection(model);
        }
    }

    switch (newRangeEx.type) {
        case SelectionRangeTypes.ImageSelection:
            const imageModel = isIndexedSegment(newRangeEx.image)
                ? newRangeEx.image.__roosterjsContentModel.segments[0]
                : null;

            if (imageModel?.segmentType == 'Image') {
                imageModel.isSelected = true;
                imageModel.isSelectedAsImageSelection = true;

                return true;
            }

            break;

        case SelectionRangeTypes.TableSelection:
            const rows = isIndexedTable(newRangeEx.table)
                ? newRangeEx.table.__roosterjsContentModel.tableRows
                : null;
            const { firstCell, lastCell } = newRangeEx.coordinates ?? UnSelectedCoordinates;

            rows?.forEach((row, rowIndex) => {
                row.cells.forEach((cell, colIndex) => {
                    cell.isSelected =
                        rowIndex >= firstCell.y &&
                        rowIndex <= lastCell.y &&
                        colIndex >= firstCell.x &&
                        colIndex <= lastCell.x;
                });
            });

            return true;

        case SelectionRangeTypes.Normal:
            const newRange = newRangeEx.ranges[0];
            if (newRange) {
                const {
                    startContainer,
                    startOffset,
                    endContainer,
                    endOffset,
                    collapsed,
                } = newRange;

                if (collapsed) {
                    return !!reconcileNodeSelection(startContainer, startOffset);
                } else if (
                    startContainer == endContainer &&
                    isNodeOfType(startContainer, 'TEXT_NODE')
                ) {
                    return (
                        isIndexedSegment(startContainer) &&
                        !!reconcileTextSelection(startContainer, startOffset, endOffset)
                    );
                } else {
                    const marker1 = reconcileNodeSelection(startContainer, startOffset);
                    const marker2 = reconcileNodeSelection(endContainer, endOffset);

                    if (marker1 && marker2) {
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
 * Implementation of ContentModelDomIndexer
 */
export const contentModelDomIndexer: ContentModelDomIndexer = {
    onSegment,
    onParagraph,
    onTable,
    reconcileSelection,
};
