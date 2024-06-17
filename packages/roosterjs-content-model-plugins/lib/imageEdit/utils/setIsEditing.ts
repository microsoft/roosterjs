import { mutateSegment } from 'roosterjs-content-model-dom';
import type { EditableImageFormat } from '../types/EditableImageFormat';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * @internal
 */
export function setIsEditing(imageAndParagraph: ImageAndParagraph, isEditing: boolean) {
    mutateSegment(imageAndParagraph.paragraph, imageAndParagraph.image, image => {
        (image.format as EditableImageFormat).isEditing = isEditing;
    });
}
