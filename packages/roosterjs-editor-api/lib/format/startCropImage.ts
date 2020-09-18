import { PluginEventType, StartCropEvent, IEditor } from 'roosterjs-editor-types';

/**
 * Rotate an image
 * @param editor The editor instance
 * @param image The selected image file
 */
export default function startCropImage(editor: IEditor): void {
    editor.addUndoSnapshot(() => {
        //image.style.transform = 'scale(3,1)'; // this should call the plugin to actually CROP: ImageCrop plugin

        //TRY EVENT FOR PLUGIN
        //this.editor.triggerContentChangedEvent(ChangeSource.ImageCrop); //try this, otherwise use triggerEvent and create new type of event
        // could not pass the raw event??

        let event: StartCropEvent = {
            eventType: PluginEventType.StartCrop,
            test: 'ania string test',
        };

        editor.triggerPluginEvent(PluginEventType.StartCrop, event, true);
    });
}
