import applyChange from '../editInfoUtils/applyChange';
import { getEditInfoFromImage } from '../editInfoUtils/editInfo';
import { IEditor } from 'roosterjs-editor-types/lib';

/**
 *
 */
export default function flipImage(editor: IEditor, image: HTMLImageElement) {
    const editInfo = getEditInfoFromImage(image);
    if (!editor.isDisposed() && editor.contains(image) && editInfo) {
        const lastSrc = image.getAttribute('src');
        if (!editInfo.flippedImage) {
            const resetedImage = image;
            resetedImage.style.width = '';
            resetedImage.style.height = '';
            resetedImage.style.maxWidth = '100%';
            resetedImage.removeAttribute('width');
            resetedImage.removeAttribute('height');
            const flippedImage = flip(editor, resetedImage);
            editInfo.flippedImage = flippedImage;
            editor.addUndoSnapshot(() => {
                applyChange(editor, image, editInfo, lastSrc || '', true /*wasResized*/);
            }, 'flippedImage');
        } else {
            editInfo.flippedImage = '';
            editor.addUndoSnapshot(() => {
                applyChange(editor, image, editInfo, lastSrc || '', true /*wasResized*/);
            }, 'flippedImage');
        }
    }
}

function flip(editor: IEditor, image: HTMLImageElement) {
    const doc = editor.getDocument();
    const canvas = doc.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    return canvas.toDataURL('image/png', 1.0);
}
