import { EditorPlugin } from 'roosterjs-editor-types';

/**
 * Represents a plugin to help get HTML content from editor
 */
export default interface UpdateContentPlugin extends EditorPlugin {
    /**
     * Force trigger a content update from editor to the callback function
     */
    forceUpdate: () => void;
}
