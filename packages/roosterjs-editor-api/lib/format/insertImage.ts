import { Editor } from 'roosterjs-editor-core';

export default function insertImage(editor: Editor, imageFile: File) {
    editor.addUndoSnapshot();
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
        if (!editor.isDisposed()) {
            let image = editor.getDocument().createElement('img');
            image.src = (event.target as FileReader).result;
            image.style.maxWidth = '100%';
            editor.insertNode(image);
            editor.addUndoSnapshot();
        }
    };
    reader.readAsDataURL(imageFile);
}
