import { EditableImageFormat } from '../types/EditableImageFormat';
import { ImageAndParagraph } from '../types/ImageAndParagraph';
import { mutateSegment } from 'roosterjs-content-model-dom';

export function setIsEditing(imageAndParagraph: ImageAndParagraph, isEditing: boolean) {
    mutateSegment(imageAndParagraph.paragraph, imageAndParagraph.image, image => {
        (image.format as EditableImageFormat).isEditing = isEditing;
    });
}
