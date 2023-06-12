import { addSegment } from '../../modelApi/common/addSegment';
import { createContentModelDocument } from '../../modelApi/creators/createContentModelDocument';
import { createImage } from '../../modelApi/creators/createImage';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from '../../editor/utils/handleKeyboardEventCommon';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
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
        const image = createImage(src);
        const doc = createContentModelDocument();

        addSegment(doc, image);
        mergeModel(model, doc, getOnDeleteEntityCallback(editor), {
            mergeFormat: 'mergeAll',
        });

        return true;
    });
}
