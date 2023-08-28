import { cloneText } from '../../modelApi/common/cloneModel';
import { ContentModelCachePluginState } from '../../publicTypes/pluginState/ContentModelCachePluginState';
import { createSelectionMarker } from 'roosterjs-content-model-dom';
import {
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelText,
    DomToModelCallback,
} from 'roosterjs-content-model-types';

/**
 *
 */
interface IndexedNode extends Node {
    /**
     *
     */
    segmentIndex?: number;
}

interface IndexedSegment extends ContentModelText {
    /**
     *
     */
    segmentIndex?: number;
}

/**
 * @internal
 */
export function createOnNewTextSegmentCallbacks(
    cache: ContentModelCachePluginState
): DomToModelCallback {
    return {
        onNewTextNode: (node: Node) => {
            delete (node as IndexedNode).segmentIndex;
        },
        onNewTextSegment: (
            paragraph: ContentModelParagraph,
            segment: ContentModelText,
            node: Node
        ) => {
            const indexedNode = node as IndexedNode;
            const indexedSegment = segment as IndexedSegment;
            const indexNum = indexedNode.segmentIndex ?? cache.nextSequenceNumber++;

            indexedNode.segmentIndex = indexNum;
            indexedSegment.segmentIndex = indexNum;

            const entry = cache.index[indexNum];

            if (!entry) {
                cache.index[indexNum] = { paragraph, segment };
            } else {
                if (Array.isArray(entry.segment)) {
                    entry.segment.push(segment);
                } else {
                    entry.segment = [entry.segment, segment];
                }
            }
        },
    };
}

/**
 * @internal
 * @param cache
 * @param textNode
 * @param offset
 */
export function reconcileCachedSelection(
    cache: ContentModelCachePluginState,
    textNode: Node,
    offset?: number
) {
    const index = (textNode as IndexedNode).segmentIndex ?? -1;
    const { paragraph, segment } = cache.index[index] || {};

    if (paragraph && segment) {
        const first: IndexedSegment = Array.isArray(segment) ? segment[0] : segment;
        const last = Array.isArray(segment) ? segment[segment.length - 1] : segment;
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

            const newSegments: ContentModelSegment[] = [];
            const txt = textNode.nodeValue || '';
            const textSegments: ContentModelText[] = [];

            if (offset === undefined) {
                first.text = txt;
                newSegments.push(first);
                textSegments.push(first);
            } else {
                if (offset > 0) {
                    first.text = txt.substring(0, offset);
                    newSegments.push(first);
                    textSegments.push(first);
                }

                newSegments.push(createSelectionMarker(first.format));

                if (offset < txt.length - 1) {
                    const second = cloneText(first) as IndexedSegment;

                    second.text = txt.substring(offset);
                    second.segmentIndex = first.segmentIndex;
                    newSegments.push(second);
                    textSegments.push(second);
                }
            }

            paragraph.segments.splice(firstIndex, lastIndex - firstIndex + 1, ...newSegments);
            cache.index[index] = {
                paragraph,
                segment: textSegments.length == 1 ? textSegments[0] : textSegments,
            };
        }
    }
}
