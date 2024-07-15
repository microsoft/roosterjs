import { mutateBlock } from 'roosterjs-content-model-dom';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * Selecting directly on the image will only capture the image segment.
 * However, if the selection is made while the image is within a wrapper, it will capture the span that encloses the image.
 * In the last case, the selection will be marked as <---SelectionMarker---><---Image---><---SelectionMarker--->.
 * To fix this behavior the extra selection markers are removed.
 * @internal
 */
export function normalizeImageSelection(imageAndParagraph: ImageAndParagraph) {
    const paragraph = imageAndParagraph.paragraph;
    const index = paragraph.segments.indexOf(imageAndParagraph.image);
    if (index > 0) {
        const markerBefore = paragraph.segments[index - 1];
        const markerAfter = paragraph.segments[index + 1];
        if (
            markerBefore &&
            markerAfter &&
            markerAfter.segmentType == 'SelectionMarker' &&
            markerBefore.segmentType == 'SelectionMarker' &&
            markerAfter.isSelected &&
            markerBefore.isSelected
        ) {
            const mutatedParagraph = mutateBlock(paragraph);
            mutatedParagraph.segments.splice(index - 1, 1);
            mutatedParagraph.segments.splice(index, 1);
        }
        return imageAndParagraph;
    }
}
