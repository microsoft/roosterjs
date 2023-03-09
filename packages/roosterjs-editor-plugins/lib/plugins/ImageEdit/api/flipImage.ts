import { getEditInfoFromImage, saveEditInfo } from '../editInfoUtils/editInfo';
import { IEditor } from 'roosterjs-editor-types/lib';

/**
 *
 */
export default function flipImage(editor: IEditor, image: HTMLImageElement) {
    const editInfo = getEditInfoFromImage(image);
    if (!editor.isDisposed() && editor.contains(image) && editInfo) {
        const flippedImaged = flip(editor, image);
        image.src = flippedImaged;
        editor.addUndoSnapshot(() => {
            editInfo.flipped = !editInfo.flipped;
            saveEditInfo(image, editInfo);
        }, 'flippedImage');
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
