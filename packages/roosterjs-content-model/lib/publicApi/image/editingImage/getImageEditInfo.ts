import {
    ContentModelImage,
    IContentModelEditor,
    ImageMetadataFormat,
} from 'roosterjs-content-model/lib/publicTypes';

export function getImageEditInfo(
    editor: IContentModelEditor,
    image: ContentModelImage
): ImageMetadataFormat {
    const editInfo = image.dataset.editingInfo;
    if (editInfo) {
        return JSON.parse(editInfo);
    } else {
        const newImage = editor.getDocument().createElement('img');
        newImage.src = image.src;
        return {
            src: image.src,
            widthPx: newImage.width,
            heightPx: newImage.height,
            naturalWidth: newImage.naturalWidth,
            naturalHeight: newImage.naturalHeight,
            angleRad: 0,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
        };
    }
}
