import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom/lib';
import { ImageAndParagraph } from '../types/ImageAndParagraph';
import { ReadonlyContentModelDocument } from 'roosterjs-content-model-types/lib';

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
