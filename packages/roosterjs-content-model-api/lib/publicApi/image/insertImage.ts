import {
    mergeModel,
    readFile,
    addSegment,
    createContentModelDocument,
    createImage,
    isNodeOfType,
    isElementOfType,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Insert an image into current selected position
 * @param editor The editor to operate on
 * @param file Image Blob file or source string
 */
export function insertImage(editor: IEditor, imageFileOrSrc: File | string) {
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

function insertImageWithSrc(editor: IEditor, src: string) {
    const image = createImage(src, { backgroundColor: '' });
    let imageNode: HTMLImageElement | undefined;

    editor.formatContentModel(
        (model, context) => {
            const doc = createContentModelDocument();

            addSegment(doc, image);
            mergeModel(model, doc, context, {
                mergeFormat: 'mergeAll',
            });

            return true;
        },
        {
            apiName: 'insertImage',
            onNodeCreated: (model, node) => {
                if (
                    model == image &&
                    isNodeOfType(node, 'ELEMENT_NODE') &&
                    isElementOfType(node, 'img')
                ) {
                    imageNode = node;
                }
            },
        }
    );

    if (imageNode) {
        editor.setDOMSelection({
            type: 'image',
            image: imageNode,
        });
    }
}
