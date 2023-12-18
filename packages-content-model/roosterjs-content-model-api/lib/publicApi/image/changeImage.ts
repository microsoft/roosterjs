import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { PluginEventType } from 'roosterjs-editor-types';
import { readFile, updateImageMetadata } from 'roosterjs-content-model-core';
import type { ContentModelImage, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export default function changeImage(editor: IStandaloneEditor, file: File) {
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
