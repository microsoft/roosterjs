import { getMetadata, updateMetadata } from './updateMetadata';
import {
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from './definitionCreators';
import type {
    ContentModelImage,
    ImageMetadataFormat,
    ReadonlyContentModelImage,
} from 'roosterjs-content-model-types';

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
 * Get image metadata
 * @param image The image Content Model
 */
export function getImageMetadata(image: ReadonlyContentModelImage): ImageMetadataFormat | null {
    return getMetadata(image, ImageMetadataFormatDefinition);
}

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
