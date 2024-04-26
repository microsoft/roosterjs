import { updateImageMetadata } from 'roosterjs-content-model-dom';
import type { ContentModelImage, ImageMetadataFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function updateImageEditInfo(
    image: HTMLImageElement,
    contentModelImage: ContentModelImage,
    newImageMetadata?: ImageMetadataFormat | null
): ImageMetadataFormat {
    const imageInfo = updateImageMetadata(
        contentModelImage,
        newImageMetadata !== undefined
            ? format => {
                  format = newImageMetadata;
                  return format;
              }
            : undefined
    );

    return imageInfo || getInitialEditInfo(image);
}

function getInitialEditInfo(image: HTMLImageElement): ImageMetadataFormat {
    return {
        src: image.getAttribute('src') || '',
        widthPx: image.clientWidth,
        heightPx: image.clientHeight,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
        angleRad: 0,
    };
}
