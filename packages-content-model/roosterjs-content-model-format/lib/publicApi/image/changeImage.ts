import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { PluginEventType } from 'roosterjs-editor-types';
import { readFile } from '../../domUtils/readFile';
import { updateImageMetadata } from 'roosterjs-content-model-editor';
import type { ContentModelImage } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export function changeImage(editor: IContentModelEditor, file: File) {
    editor.focus();

    const selection = editor.getDOMSelection();
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed() && selection?.type === 'image') {
            formatImageWithContentModel(editor, 'changeImage', (image: ContentModelImage) => {
                const originalSrc = updateImageMetadata(image)?.src ?? '';
                const previousSrc = image.src;

                image.src = dataUrl;
                image.dataset = {};
                image.format.width = '';
                image.format.height = '';
                image.alt = '';

                editor.triggerPluginEvent(PluginEventType.EditImage, {
                    image: selection.image,
                    previousSrc,
                    newSrc: dataUrl,
                    originalSrc,
                });
            });
        }
    });
}
