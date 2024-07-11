import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type { ReadonlyContentModelDocument } from 'roosterjs-content-model-types';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * Selecting directly on the image will only capture the image segment.
 * However, if the selection is made while the image is within a wrapper, it will capture the span that encloses the image.
 * In the last case, the selection will be marked as <---SelectionMarker---><---Image---><---SelectionMarker--->.
 * This function accounts for both scenarios.
 * @internal
 */
export function getSelectedImage(model: ReadonlyContentModelDocument): ImageAndParagraph | null {
    const selections = getSelectedSegmentsAndParagraphs(model, false);
    if (selections.length == 1 && selections[0][0].segmentType == 'Image' && selections[0][1]) {
        return {
            image: selections[0][0],
            paragraph: selections[0][1],
        };
    } else if (
        selections.length == 3 &&
        selections[1][1] &&
        selections[1][1].segments.every(
            seg =>
                (seg.segmentType == 'Image' || seg.segmentType == 'SelectionMarker') &&
                seg.isSelected
        ) &&
        selections[1][0].segmentType == 'Image' &&
        selections[1][0].isSelectedAsImageSelection == true
    ) {
        return {
            image: selections[1][0],
            paragraph: selections[1][1],
        };
    } else {
        return null;
    }
}
