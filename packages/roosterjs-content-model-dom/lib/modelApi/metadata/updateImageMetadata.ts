import { updateMetadata } from './updateMetadata';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from './definitionCreators';
import type { ContentModelImage, ImageMetadataFormat } from 'roosterjs-content-model-types';

const NumberDefinition = createNumberDefinition(true);
const BooleanDefinition = createBooleanDefinition(true);

/**
 * @internal
 * Definition of ImageMetadataFormat
 */
export const ImageMetadataFormatDefinition = createObjectDefinition<Required<ImageMetadataFormat>>({
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
    flippedHorizontal: BooleanDefinition,
    flippedVertical: BooleanDefinition,
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
