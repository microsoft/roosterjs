import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image file. There are at least 3 ways to obtain the file object:
 * From local file, from clipboard data, from drag-and-drop
 */
export default function insertImage(editor: Editor, imageFile: File): void;

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image link.
 */
export default function insertImage(editor: Editor, url: string): void;

export default function insertImage(editor: Editor, imageFile: File | string): void {
    if (typeof imageFile == 'string') {
        insertImageWithSrc(editor, imageFile);
    } else {
        let reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
            if (!editor.isDisposed()) {
                insertImageWithSrc(editor, (event.target as FileReader).result as string);
            }
        };
        reader.readAsDataURL(imageFile);
    }
}

function insertImageWithSrc(editor: Editor, src: string) {
    editor.addUndoSnapshot(() => {
        const image = editor.getDocument().createElement('img');
        image.src = src;
        image.style.maxWidth = '100%';
        editor.insertNode(image);
    }, ChangeSource.Format);
}
