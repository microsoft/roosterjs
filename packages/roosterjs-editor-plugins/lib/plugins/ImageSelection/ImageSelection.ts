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
    private image: HTMLImageElement | null = null;

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
        this.image = null;
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
                    if (this.image) {
                        const image = this.editor.queryElements('#' + this.image.id);
                        if (image.length == 1) {
                            this.image = image[0] as HTMLImageElement;
                            this.editor.select(this.image);
                        }
                    }
                    break;
                case PluginEventType.MouseDown:
                    const target = event.rawEvent.target;
                    if (safeInstanceOf(target, 'HTMLImageElement')) {
                        this.image = target;
                        this.editor.select(this.image);
                    } else {
                        this.image = null;
                    }
                    break;
            }
        }
    }
}
