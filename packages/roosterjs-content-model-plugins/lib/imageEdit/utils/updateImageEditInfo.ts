import { getSelectedSegments, updateImageMetadata } from 'roosterjs-content-model-dom';
import type { IEditor, ImageMetadataFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function updateImageEditInfo(
    editor: IEditor,
    image: HTMLImageElement,
    newImageMetadata?: ImageMetadataFormat | null
): ImageMetadataFormat {
    const model = editor.getContentModelCopy('disconnected' /*mode*/);
    const selectedSegments = getSelectedSegments(model, false /*includeFormatHolder*/);
    if (selectedSegments.length !== 1 || selectedSegments[0].segmentType !== 'Image') {
        return getInitialEditInfo(image);
    }
    const imageInfo = updateImageMetadata(
        selectedSegments[0],
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
