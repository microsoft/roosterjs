import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { insertContent } from '../../modelApi/common/insertContent';
import { readFile } from 'roosterjs-editor-dom';

/**
 * Insert an image into current selected position
 * @param editor The editor to operate on
 * @param file Image Blob file
 */
export default function insertImage(editor: IExperimentalContentModelEditor, file: File) {
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed()) {
            formatWithContentModel(editor, 'insertImage', model => {
                const image = editor.getDocument().createElement('img');

                image.src = dataUrl;
                insertContent(model, image);
                return true;
            });
        }
    });
}
