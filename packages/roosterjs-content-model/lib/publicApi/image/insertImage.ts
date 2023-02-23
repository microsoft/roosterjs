import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { insertContent } from '../../modelApi/common/insertContent';
import { readFile } from 'roosterjs-editor-dom';

/**
 * Insert an image into current selected position
 * @param editor The editor to operate on
 * @param file Image Blob file or source string
 */
export default function insertImage(editor: IContentModelEditor, imageFileOrSrc: File | string) {
    if (typeof imageFileOrSrc == 'string') {
        insertImageWithSrc(editor, imageFileOrSrc);
    } else {
        readFile(imageFileOrSrc, dataUrl => {
            if (dataUrl && !editor.isDisposed()) {
                insertImageWithSrc(editor, dataUrl);
            }
        });
    }
}

function insertImageWithSrc(editor: IContentModelEditor, src: string) {
    formatWithContentModel(editor, 'insertImage', model => {
        const image = editor.getDocument().createElement('img');

        image.src = src;
        insertContent(model, image);
        return true;
    });
}
