import { addSegment, createContentModelDocument, createImage } from 'roosterjs-content-model-dom';
import { mergeModel } from 'roosterjs-content-model-core';
import { readFile } from '../../modelApi/domUtils/readFile';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Insert an image into current selected position
 * @param editor The editor to operate on
 * @param file Image Blob file or source string
 */
export default function insertImage(editor: IStandaloneEditor, imageFileOrSrc: File | string) {
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

function insertImageWithSrc(editor: IStandaloneEditor, src: string) {
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
