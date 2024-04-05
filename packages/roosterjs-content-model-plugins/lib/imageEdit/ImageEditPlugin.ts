import { ImageEditOptions } from './types/ImageEditOptions';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    SelectionChangedEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: Partial<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
};

/**
 * ImageEdit plugin handles the following image editing features:
 * - Resize image
 * - Crop image
 * - Rotate image
 */
export class ImageEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    constructor(private options: ImageEditOptions = DefaultOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ImageEdit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case 'selectionChanged':
                    this.handleSelectionChangedEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleSelectionChangedEvent(editor: IEditor, event: SelectionChangedEvent) {}
}
