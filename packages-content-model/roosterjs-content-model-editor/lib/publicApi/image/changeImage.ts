import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { readFile } from '../../domUtils/readFile';
import type { ContentModelImage } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export default function changeImage(editor: IContentModelEditor, file: File) {
    editor.focus();

    const selection = editor.getDOMSelection();
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed() && selection?.type === 'image') {
            formatImageWithContentModel(editor, 'changeImage', (image: ContentModelImage) => {
                const previousSrc = image.src;

                image.src = dataUrl;
                image.dataset = {};
                image.format.width = '';
                image.format.height = '';
                image.alt = '';

                editor.triggerPluginEvent('editImage', {
                    image,
                    previousSrc,
                    newSrc: dataUrl,
                });
            });
        }
    });
}
