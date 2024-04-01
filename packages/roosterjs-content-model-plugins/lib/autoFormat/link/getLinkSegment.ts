import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { matchLink } from 'roosterjs-content-model-api';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getLinkSegment(model: ContentModelDocument) {
    const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
        model,
        false /* includingFormatHolder */
    );
    if (selectedSegmentsAndParagraphs.length == 1 && selectedSegmentsAndParagraphs[0][1]) {
        const selectedParagraph = selectedSegmentsAndParagraphs[0][1];
        const marker = selectedParagraph.segments[selectedParagraph.segments.length - 1];
        const link = selectedParagraph.segments[selectedParagraph.segments.length - 2];
        if (
            marker &&
            link &&
            marker.segmentType === 'SelectionMarker' &&
            marker.isSelected &&
            link.segmentType === 'Text' &&
            (matchLink(link.text) || link.link)
        ) {
            return link;
        }
    }
    return undefined;
}
