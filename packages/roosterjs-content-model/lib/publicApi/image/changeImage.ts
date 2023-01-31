import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { readFile } from 'roosterjs-editor-dom';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export default function changeImage(editor: IExperimentalContentModelEditor, file: File) {
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed()) {
            formatImageWithContentModel(editor, 'changeImage', (image: ContentModelImage) => {
                image.src = dataUrl;
                image.dataset = {};
                image.format.width = '';
                image.format.height = '';
            });
        }
    });
}
