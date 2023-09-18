import { isNodeOfType } from 'roosterjs-content-model-dom';
import { NodeType } from 'roosterjs-editor-types';
import {
    ContentModelDomIndexer,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelText,
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

/**
 * @internal
 * Update indexed text segments when need
 * @param node The source node
 * @param callback Update callback
 * @returns True if update successfully, otherwise false
 */
export function updateTextSegments(
    node: Node,
    callback: (
        paragraph: ContentModelParagraph,
        first: ContentModelText,
        last: ContentModelText
    ) => ContentModelText[]
): boolean {
    if (isIndexedNode(node)) {
        const { paragraph, segments } = node.segmentIndex;
        const first = segments[0];
        const last = segments[segments.length - 1];

        if (first?.segmentType == 'Text' && last?.segmentType == 'Text') {
            const newTexts = callback(paragraph, first, last);

            node.segmentIndex = {
                paragraph,
                segments: newTexts,
            };

            delete paragraph.cachedElement;

            return true;
        }
    }

    return false;
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
};
