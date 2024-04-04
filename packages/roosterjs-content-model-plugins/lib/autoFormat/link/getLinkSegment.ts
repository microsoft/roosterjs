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
        const marker = selectedSegmentsAndParagraphs[0][0];
        if (marker && marker.segmentType === 'SelectionMarker') {
            const markerIndex = selectedParagraph.segments.indexOf(marker);
            const link = selectedParagraph.segments[markerIndex - 1];
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
    }
    return undefined;
}
