import generateRotateImageURL from './generateRotatedImageURL';
import getGeneratedImageSize from './getGeneratedImageSize';
import { ContentModelImage, ImageMetadataFormat } from 'roosterjs-content-model/lib/publicTypes';
import { IEditor, PluginEventType } from 'roosterjs-editor-types';
import { updateImageMetadata } from 'roosterjs-content-model/lib/domUtils';

/**
 */
export default function applyChange(
    editor: IEditor,
    image: ContentModelImage,
    editInfo: ImageMetadataFormat
) {
    const doc = editor.getDocument();
    const newImage = doc.createElement('img');
    newImage.src = image.src;
    const newSrc = generateRotateImageURL(newImage, editInfo);

    editor.triggerPluginEvent(PluginEventType.EditImage, {
        image: newImage,
        originalSrc: editInfo.src || '',
        previousSrc: image.src,
        newSrc,
    });

    // Write back the change to image, and set its new size
    const { targetWidth, targetHeight } = getGeneratedImageSize(editInfo);
    image.src = newSrc;
    image.format.width = targetWidth + 'px';
    image.format.height = targetHeight + 'px';

    updateImageMetadata(image, format => {
        if (format) {
            format.widthPx = targetWidth;
            format.heightPx = targetHeight;
        }
        return format;
    });
}
