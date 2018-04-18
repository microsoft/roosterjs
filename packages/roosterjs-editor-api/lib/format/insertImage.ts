import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

export type InsertImageHandler = (editor: Editor, imageFile: File) => void;

/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image file. There are at least 3 ways to obtain the file object:
 * From local file, from clipboard data, from drag-and-drop
 */
export default function insertImage(editor: Editor, imageFile: File) {
    editor.addUndoSnapshot();
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
        if (!editor.isDisposed()) {
            let image = editor.getDocument().createElement('img');
            image.src = (event.target as FileReader).result;
            image.style.maxWidth = '100%';
            editor.insertNode(image);
            editor.triggerContentChangedEvent(ChangeSource.Format);
            editor.addUndoSnapshot();
        }
    };
    reader.readAsDataURL(imageFile);
}
