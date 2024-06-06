import { getSelectedContentModelImage } from './getSelectedContentModelImage';
import { updateImageMetadata } from 'roosterjs-content-model-dom';
import type {
    ContentModelImage,
    IEditor,
    ImageMetadataFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function updateImageEditInfo(
    contentModelImage: ContentModelImage,
    newImageMetadata?: ImageMetadataFormat | null
) {
    updateImageMetadata(
        contentModelImage,
        newImageMetadata !== undefined
            ? format => {
                  format = newImageMetadata;
                  return format;
              }
            : undefined
    );
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

/**
 * @internal
 * @returns
 */
export function getSelectedImageMetadata(
    editor: IEditor,
    image: HTMLImageElement
): ImageMetadataFormat {
    let imageMetadata: ImageMetadataFormat = getInitialEditInfo(image);
    editor.formatContentModel(model => {
        const selectedImage = getSelectedContentModelImage(model);
        if (selectedImage) {
            imageMetadata = { ...imageMetadata, ...selectedImage.dataset };
        }
        return false;
    });

    return imageMetadata;
}
