import { EditorPlugin } from 'roosterjs-editor-types';

/**
 * ImageEdit plugin provides the ability to edit an inline image in editor, including image resizing, rotation and cropping
 */
export default class ImageEdit implements EditorPlugin {
    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'ImageEdit';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize() {}

    /**
     * Dispose this plugin
     */
    dispose() {}
}
