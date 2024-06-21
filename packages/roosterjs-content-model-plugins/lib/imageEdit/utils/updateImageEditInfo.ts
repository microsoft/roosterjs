import { getSelectedImage } from './getSelectedImage';
import { mutateSegment, updateImageMetadata } from 'roosterjs-content-model-dom';

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
    image: HTMLImageElement,
    newImageMetadata?: ImageMetadataFormat | null | undefined
): ImageMetadataFormat {
    const contentModelMetadata = updateImageMetadata(
        contentModelImage,
        newImageMetadata !== undefined
            ? format => {
                  format = newImageMetadata;
                  return format;
              }
            : undefined
    );
    return { ...getInitialEditInfo(image), ...contentModelMetadata };
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
        const selectedImage = getSelectedImage(model);
        if (selectedImage?.image) {
            mutateSegment(selectedImage.paragraph, selectedImage?.image, modelImage => {
                imageMetadata = updateImageEditInfo(modelImage, image);
            });

            return true;
        }
        return false;
    });

    return imageMetadata;
}
