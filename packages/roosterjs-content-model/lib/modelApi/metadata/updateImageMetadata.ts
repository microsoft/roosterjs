import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ImageMetadataFormat } from '../../publicTypes/format/formatParts/ImageMetadataFormat';
import { updateMetadata } from './updateMetadata';

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
 * @internal
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
