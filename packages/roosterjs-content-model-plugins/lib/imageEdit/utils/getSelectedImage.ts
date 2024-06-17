import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type { ReadonlyContentModelDocument } from 'roosterjs-content-model-types';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * @internal
 */
export function getSelectedImage(model: ReadonlyContentModelDocument): ImageAndParagraph | null {
    const selections = getSelectedSegmentsAndParagraphs(model, false);

    if (selections.length == 1 && selections[0][0].segmentType == 'Image' && selections[0][1]) {
        return {
            image: selections[0][0],
            paragraph: selections[0][1],
        };
    } else {
        return null;
    }
}
