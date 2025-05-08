import { queryContentModelBlocks } from 'roosterjs-content-model-api';
import type {
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * @internal
 */
export const EDITING_MARKER = 'isEditing';

/**
 * @internal
 */
export function findEditingImage(
    group: ReadonlyContentModelBlockGroup,
    imageId?: string
): ImageAndParagraph | null {
    let imageAndParagraph: ImageAndParagraph | null = null;
    queryContentModelBlocks<ReadonlyContentModelParagraph>(
        group,
        'Paragraph',
        (paragraph: ReadonlyContentModelParagraph): paragraph is ReadonlyContentModelParagraph => {
            for (const segment of paragraph.segments) {
                if (
                    segment.segmentType == 'Image' &&
                    ((imageId && segment.format.id == imageId) ||
                        segment.format.imageState == EDITING_MARKER)
                ) {
                    imageAndParagraph = { image: segment, paragraph };
                    return true;
                }
            }
            return false;
        },
        true /*findFirstOnly*/
    );

    return imageAndParagraph;
}
