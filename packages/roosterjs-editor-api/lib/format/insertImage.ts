import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { readFile } from 'roosterjs-editor-dom';

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image file. There are at least 3 ways to obtain the file object:
 * From local file, from clipboard data, from drag-and-drop
 */
export default function insertImage(editor: IEditor, imageFile: File): void;

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image link.
 */
export default function insertImage(editor: IEditor, url: string): void;

export default function insertImage(editor: IEditor, imageFile: File | string): void {
    if (typeof imageFile == 'string') {
        insertImageWithSrc(editor, imageFile);
    } else {
        readFile(imageFile, dataUrl => {
            if (dataUrl && !editor.isDisposed()) {
                insertImageWithSrc(editor, dataUrl);
            }
        });
    }
}

function insertImageWithSrc(editor: IEditor, src: string) {
    editor.addUndoSnapshot(() => {
        const image = editor.getDocument().createElement('img');
        image.src = src;
        image.style.maxWidth = '100%';
        image.setAttribute('insertedImage', 'true');
        editor.insertNode(image);
    }, ChangeSource.Format);
}
