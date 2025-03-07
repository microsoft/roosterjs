import { setupHintTextNode } from '../../domUtils/hintText';
import type {
    ContentModelSegmentHandler,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSelectionMarker: ContentModelSegmentHandler<ContentModelSelectionMarker> = (
    doc,
    parent,
    segment,
    _,
    segmentNodes
) => {
    if (segment.hintText) {
        const hintNode = doc.createElement('span');

        setupHintTextNode(hintNode, segment.hintText);

        parent.appendChild(hintNode);

        segmentNodes?.push(hintNode);
    }
};
