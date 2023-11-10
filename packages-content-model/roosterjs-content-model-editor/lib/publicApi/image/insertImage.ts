import { addSegment, createContentModelDocument, createImage } from 'roosterjs-content-model-dom';
import { mergeModel } from 'roosterjs-content-model-core';
import { readFile } from '../../domUtils/readFile';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Insert an image into current selected position
 * @param editor The editor to operate on
 * @param file Image Blob file or source string
 */
export default function insertImage(editor: IContentModelEditor, imageFileOrSrc: File | string) {
    editor.focus();

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
    editor.formatContentModel(
        (model, context) => {
            const image = createImage(src, { backgroundColor: '' });
            const doc = createContentModelDocument();

            addSegment(doc, image);
            mergeModel(model, doc, context, {
                mergeFormat: 'mergeAll',
            });

            return true;
        },
        {
            apiName: 'insertImage',
        }
    );
}
