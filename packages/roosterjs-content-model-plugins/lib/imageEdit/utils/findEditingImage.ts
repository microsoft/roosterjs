import { queryContentModel } from 'roosterjs-content-model-api';
import type {
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * @internal
 */
export function findEditingImage(
    group: ReadonlyContentModelBlockGroup,
    imageId?: string
): ImageAndParagraph | null {
    let imageAndParagraph: ImageAndParagraph | null = null;
    queryContentModel<ReadonlyContentModelParagraph>(group, {
        selector: (paragraph: ReadonlyContentModelParagraph) => {
            for (const segment of paragraph.segments) {
                if (
                    segment.segmentType == 'Image' &&
                    ((imageId && segment.format.id == imageId) || segment.dataset.isEditing)
                ) {
                    imageAndParagraph = { image: segment, paragraph };
                    break;
                }
            }
            return !!imageAndParagraph;
        },
        findFirstOnly: true,
    });
    return imageAndParagraph;
}
