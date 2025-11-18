import { addImageEditOperator, removeImageEditOperator } from '../../utils/imageEditOperator';
import { ImageEditOptions, ImageEditPlugin } from 'roosterjs-content-model-plugins';
import type { EditorPlugin, IEditor } from 'roosterjs-content-model-types';

/**
 * A plugin to help get HTML content from editor
 */
export class SampleImageEditPlugin extends ImageEditPlugin implements EditorPlugin {
    private imageEditId = 'imageEdit';

    /**
     * Create a new instance of UpdateContentPlugin class
     * @param onUpdate A callback to be invoked when update happens
     */
    constructor(options?: ImageEditOptions) {
        super(options);
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'SampleImageEditPlugin';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        addImageEditOperator(this.imageEditId, this);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        removeImageEditOperator(this.imageEditId);
    }
}
