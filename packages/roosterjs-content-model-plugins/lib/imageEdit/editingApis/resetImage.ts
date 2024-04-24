import { getImageEditInfo } from '../utils/getImageEditInfo';
import { IEditor } from 'roosterjs-content-model-types/lib';
import { removeMetadata } from '../utils/imageMetadata';

/**
 * Remove all image editing properties from an image
 * @param editor The editor that contains the image
 */
export function resetImage(editor: IEditor) {
    const selection = editor.getDOMSelection();
    if (selection?.type === 'image') {
        const image = selection.image;
        editor.triggerEvent('editImage', {
            image,
            previousSrc: image.src,
            newSrc: image.src,
            originalSrc: image.src,
            apiOperation: {
                action: 'reset',
            },
        });
        const editInfo = getImageEditInfo(image);
        if (editInfo?.src) {
            image.src = editInfo.src;
        }
        const clientWidth = editor.getDOMHelper().getClientWidth();
        image.style.width = '';
        image.style.height = '';
        image.style.maxWidth = clientWidth + 'px';
        image.removeAttribute('width');
        image.removeAttribute('height');
        removeMetadata(image);
    }
}
