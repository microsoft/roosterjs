import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * Detect image selection and help highlight the image
 */
export default class ImageSelection implements EditorPlugin {
    private editor: IEditor | null = null;
    private imageId: string | null = null;

    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor.select(null);
        this.editor = null;
        this.imageId = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.EnteredShadowEdit:
                    const selection = this.editor.getSelectionRangeEx();
                    if (selection.type == SelectionRangeTypes.ImageSelection) {
                        this.editor.select(selection.image);
                    }
                    break;
                case PluginEventType.LeavingShadowEdit:
                    if (this.imageId) {
                        const images = this.editor.queryElements(
                            '#' + this.imageId
                        ) as HTMLImageElement[];
                        if (images.length == 1) {
                            const image = images[0];
                            this.editor.select(image);
                        }
                        this.imageId = null;
                    }
                    break;
                case PluginEventType.MouseDown:
                    const target = event.rawEvent.target;
                    if (safeInstanceOf(target, 'HTMLImageElement')) {
                        this.editor.select(target);
                        this.imageId = target.id;
                    }
                    break;
            }
        }
    }
}
