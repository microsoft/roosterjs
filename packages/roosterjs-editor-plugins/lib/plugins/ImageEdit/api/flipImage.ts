import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { deleteEditInfo, getEditInfoFromImage, saveEditInfo } from '../editInfoUtils/editInfo';
import { loadImage } from './loadImage';

/**
 *
 */
export default function flipImage(
    editor: IEditor,
    image: HTMLImageElement,
    direction: 'left' | 'right'
) {
    const editInfo = getEditInfoFromImage(image);
    loadImage(image, image.src, () => {
        if (!editor.isDisposed() && editor.contains(image) && editInfo) {
            editor.addUndoSnapshot(() => {
                const originalSrc = editInfo.src;
                const flippedImage = flip(editor, image, direction);
                image.src = flippedImage;
                const tempImage = editor.getDocument().createElement('img');
                tempImage.src = originalSrc;
                const flippedOriginalImage = flip(editor, tempImage, direction);
                const newEditInfo = {
                    ...editInfo,
                    src: flippedOriginalImage,
                };
                deleteEditInfo(image);
                saveEditInfo(image, newEditInfo);
            }, ChangeSource.Format);
        }
    });
}

function flip(editor: IEditor, image: HTMLImageElement, direction: 'left' | 'right') {
    const doc = editor.getDocument();
    const canvas = doc.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context) {
        if (direction === 'left') {
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
        } else if (direction === 'right') {
            context.scale(1, 1);
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
    return canvas.toDataURL('image/png', 1.0);
}
