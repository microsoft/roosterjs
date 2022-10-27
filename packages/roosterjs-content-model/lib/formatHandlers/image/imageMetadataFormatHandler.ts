import { createMetadataFormatHandler } from '../utils/createMetadataFormatHandler';
import { ImageMetadataFormat } from '../../publicTypes/format/formatParts/ImageMetadataFormat';
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
 */
export const imageMetadataFormatHandler = createMetadataFormatHandler<ImageMetadataFormat>(
    ImageMetadataFormatDefinition,
    format => ({
        widthPx: format.widthPx,
        heightPx: format.heightPx,
        leftPercent: format.leftPercent,
        rightPercent: format.rightPercent,
        topPercent: format.topPercent,
        bottomPercent: format.bottomPercent,
        angleRad: format.angleRad,
        src: format.src,
        naturalHeight: format.naturalHeight,
        naturalWidth: format.naturalWidth,
    })
);
