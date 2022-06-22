import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { getObjectKeys, readFile } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image file. There are at least 3 ways to obtain the file object:
 * From local file, from clipboard data, from drag-and-drop
 * @param attributes Optional image element attributes
 */
export default function insertImage(
    editor: IEditor,
    imageFile: File,
    attributes?: Record<string, string>
): void;

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param url The image link
 * @param attributes Optional image element attributes
 */
export default function insertImage(
    editor: IEditor,
    url: string,
    attributes?: Record<string, string>
): void;

export default function insertImage(
    editor: IEditor,
    imageFile: File | string,
    attributes?: Record<string, string>
): void {
    if (typeof imageFile == 'string') {
        insertImageWithSrc(editor, imageFile, attributes);
    } else {
        readFile(imageFile, dataUrl => {
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

            image.style.maxWidth = '100%';
            editor.insertNode(image);
        },
        'insertImage'
    );
}
