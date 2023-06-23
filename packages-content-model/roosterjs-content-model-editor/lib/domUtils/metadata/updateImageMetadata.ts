import { ContentModelImage, ImageMetadataFormat } from 'roosterjs-content-model-types';
import { updateMetadata } from 'roosterjs-content-model-dom';
import {
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from 'roosterjs-editor-dom';

const NumberDefinition = createNumberDefinition();

const ImageMetadataFormatDefinition = createObjectDefinition<Required<ImageMetadataFormat>>({
    widthPx: NumberDefinition,
    heightPx: NumberDefinition,
    leftPercent: NumberDefinition,
    rightPercent: NumberDefinition,
    topPercent: NumberDefinition,
    bottomPercent: NumberDefinition,
    angleRad: NumberDefinition,
    src: createStringDefinition(),
    naturalHeight: NumberDefinition,
    naturalWidth: NumberDefinition,
});

/**
 * Update image metadata with a callback
 * @param image The image Content Model
 * @param callback The callback function used for updating metadata
 */
export function updateImageMetadata(
    image: ContentModelImage,
    callback?: (format: ImageMetadataFormat | null) => ImageMetadataFormat | null
): ImageMetadataFormat | null {
    return updateMetadata(image, callback, ImageMetadataFormatDefinition);
}
