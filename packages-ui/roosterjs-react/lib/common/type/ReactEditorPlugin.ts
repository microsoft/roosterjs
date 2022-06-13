import UIUtilities from './UIUtilities';
import { EditorPlugin } from 'roosterjs-editor-types';

/**
 * A sub interface of EditorPlugin to provide additional functionalities for rendering react component from the plugin
 */
export default interface ReactEditorPlugin extends EditorPlugin {
    /**
     * Set the UI utilities objects to this plugin to help render additional UI elements
     * @param uiUtilities The UI utilities object to set
     */
    setUIUtilities(uiUtilities: UIUtilities): void;
}
