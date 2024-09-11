import { formatImageWithContentModel } from '../utils/formatImageWithContentModel';
import { getImageMetadata, readFile } from 'roosterjs-content-model-dom';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export function changeImage(editor: IEditor, file: File) {
    editor.focus();

    const selection = editor.getDOMSelection();
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed() && selection?.type === 'image') {
            formatImageWithContentModel(editor, 'changeImage', (image: ContentModelImage) => {
                const originalSrc = getImageMetadata(image)?.src ?? '';
                const previousSrc = image.src;

                image.src = dataUrl;
                image.dataset = {};
                image.format.width = '';
                image.format.height = '';
                image.alt = '';

                editor.triggerEvent('editImage', {
                    image: selection.image,
                    previousSrc,
                    newSrc: dataUrl,
                    originalSrc,
                });
            });
        }
    });
}
