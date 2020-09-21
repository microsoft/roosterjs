import { PluginEventType, StartCropEvent, IEditor } from 'roosterjs-editor-types';

/**
 * Rotate an image
 * @param editor The editor instance
 * @param image The selected image file
 */
export default function startCropImage(editor: IEditor): void {
    editor.addUndoSnapshot(() => {
        let event: StartCropEvent = {
            eventType: PluginEventType.StartCrop,
        };

        editor.triggerPluginEvent(PluginEventType.StartCrop, event, true);
    });
}
