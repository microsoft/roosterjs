import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { getObjectKeys, readFile } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFileOrSrc Either the image file blob or source string of the image.
 * @param attributes Optional image element attributes
 */
export default function insertImage(
    editor: IEditor,
    imageFileOrSrc: File | string,
    attributes?: Record<string, string>
): void {
    if (typeof imageFileOrSrc == 'string') {
        insertImageWithSrc(editor, imageFileOrSrc, attributes);
    } else {
        readFile(imageFileOrSrc, dataUrl => {
            if (dataUrl && !editor.isDisposed()) {
                insertImageWithSrc(editor, dataUrl, attributes);
            }
        });
    }
}

function insertImageWithSrc(editor: IEditor, src: string, attributes?: Record<string, string>) {
    formatUndoSnapshot(
        editor,
        () => {
            const image = editor.getDocument().createElement('img');
            image.src = src;

            if (attributes) {
                getObjectKeys(attributes).forEach(attribute =>
                    image.setAttribute(attribute, attributes[attribute])
                );
            }
            editor.insertNode(image);
        },
        'insertImage'
    );
}
