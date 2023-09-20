import { createSelectionMarker, createText, isNodeOfType } from 'roosterjs-content-model-dom';
import { NodeType, SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';
import { setSelection } from '../../modelApi/selection/setSelection';
import {
    ContentModelDocument,
    ContentModelDomIndexer,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSelectionMarker,
    ContentModelText,
    Selectable,
} from 'roosterjs-content-model-types';

interface SegmentIndexItem {
    paragraph: ContentModelParagraph;
    segments: ContentModelSegment[];
}

interface IndexedNode extends Node {
    segmentIndex: SegmentIndexItem;
}

function onSegment(node: Node, paragraph: ContentModelParagraph, segment: ContentModelSegment[]) {
    const indexedText = node as IndexedNode;
    indexedText.segmentIndex = {
        paragraph,
        segments: segment,
    };
}

function onParagraph(node: Node) {
    let previousText: Text | null = null;

    for (let child = node.firstChild; child; child = child.nextSibling) {
        if (isNodeOfType(child, NodeType.Text)) {
            if (!previousText) {
                previousText = child;
            } else {
                const item = isIndexedNode(previousText) ? previousText.segmentIndex : undefined;

                if (item && isIndexedNode(child)) {
                    item.segments = item.segments.concat(child.segmentIndex.segments);
                    child.segmentIndex.segments = [];
                }
            }
        } else if (isNodeOfType(child, NodeType.Element)) {
            previousText = null;

            onParagraph(child);
        } else {
            previousText = null;
        }
    }
}

function reconcileSelection(
    model: ContentModelDocument,
    oldRangeEx: SelectionRangeEx | undefined,
    newRangeEx: SelectionRangeEx
): boolean {
    if (oldRangeEx) {
        const range: Range | undefined = oldRangeEx.ranges[0];

        if (
            oldRangeEx?.type == SelectionRangeTypes.Normal &&
            range?.collapsed &&
            isNodeOfType(range.startContainer, NodeType.Text)
        ) {
            if (isIndexedNode(range.startContainer)) {
                reconcileTextSelection(range.startContainer);
            }
        } else {
            setSelection(model);
        }
    }

    switch (newRangeEx.type) {
        case SelectionRangeTypes.ImageSelection:
            const imageModel = isIndexedNode(newRangeEx.image)
                ? newRangeEx.image.segmentIndex.segments[0]
                : null;

            if (imageModel?.segmentType == 'Image') {
                imageModel.isSelected = true;
                imageModel.isSelectedAsImageSelection = true;

                return true;
            }

            break;

        case SelectionRangeTypes.TableSelection:
            // Cannot handle table selection for now, so just return false and create a new model
            return false;

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
                    isNodeOfType(startContainer, NodeType.Text)
                ) {
                    return (
                        isIndexedNode(startContainer) &&
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
    if (isNodeOfType(node, NodeType.Text)) {
        return isIndexedNode(node) ? reconcileTextSelection(node, offset) : undefined;
    } else if (offset >= node.childNodes.length) {
        return insertMarker(node.lastChild, true /*isAfter*/);
    } else {
        return insertMarker(node.childNodes[offset], false /*isAfter*/);
    }
}

function insertMarker(node: Node | null, isAfter: boolean): Selectable | undefined {
    let marker: ContentModelSelectionMarker | undefined;

    if (node && isIndexedNode(node)) {
        const { paragraph, segments } = node.segmentIndex;
        const index = paragraph.segments.indexOf(segments[0]);

        if (index >= 0) {
            const formatSegment =
                (!isAfter && paragraph.segments[index - 1]) || paragraph.segments[index];
            marker = createSelectionMarker(
                formatSegment?.segmentType == 'Text' ? formatSegment.format : undefined
            );

            paragraph.segments.splice(isAfter ? index + 1 : index, 0, marker);
        }
    }

    return marker;
}

function reconcileTextSelection(textNode: IndexedNode, startOffset?: number, endOffset?: number) {
    const { paragraph, segments } = textNode.segmentIndex;
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

        textNode.segmentIndex = {
            paragraph,
            segments: textSegments,
        };

        delete paragraph.cachedElement;
    }

    return selectable;
}

function isIndexedNode(node: Node): node is IndexedNode {
    const { paragraph, segments } = (node as IndexedNode).segmentIndex ?? {};

    return (
        paragraph &&
        paragraph.blockType == 'Paragraph' &&
        Array.isArray(paragraph.segments) &&
        Array.isArray(segments) &&
        segments.length > 0
    );
}

/**
 * @internal
 * Implementation of ContentModelDomIndexer
 */
export const contentModelDomIndexer: ContentModelDomIndexer = {
    onSegment,
    onParagraph,
    reconcileSelection,
};
