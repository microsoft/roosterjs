import { addSegment, createContentModelDocument, createImage } from 'roosterjs-content-model-dom';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { readFile } from 'roosterjs-editor-dom';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

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
    formatWithContentModel(editor, 'insertImage', (model, context) => {
        const image = createImage(src, { backgroundColor: '' });
        const doc = createContentModelDocument();

        addSegment(doc, image);
        mergeModel(model, doc, context, {
            mergeFormat: 'mergeAll',
        });

        return true;
    });
}
