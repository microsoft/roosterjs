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
    if (imageFile instanceof File) {
        let reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
            if (!editor.isDisposed()) {
                editor.addUndoSnapshot(() => {
                    let image = editor.getDocument().createElement('img');
                    image.src = (event.target as FileReader).result as string;
                    image.style.maxWidth = '100%';
                    editor.insertNode(image);
                }, ChangeSource.Format);
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        if (!editor.isDisposed()) {
            editor.addUndoSnapshot(() => {
                const image = editor.getDocument().createElement('img')
                image.src = imageFile
                image.style.maxWidth = '100%'
                editor.insertNode(image)
            }, ChangeSource.Format)
        }
    }
}
