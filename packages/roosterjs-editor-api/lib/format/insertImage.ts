import { Editor } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * Insert an image to editor
 * @param editor The editor instance
 * @param imageFile The image file
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
            editor.triggerEvent({
                eventType: PluginEventType.ContentChanged,
                source: 'Format',
            } as PluginEvent);
            editor.addUndoSnapshot();
        }
    };
    reader.readAsDataURL(imageFile);
}
