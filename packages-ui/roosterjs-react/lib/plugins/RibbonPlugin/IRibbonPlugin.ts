import RibbonButton from './RibbonButton';
import { EditorPlugin, FormatState } from 'roosterjs-editor-types';

/**
 * Represents a plugin to connect format ribbon component and the editor
 */
export default interface IRibbonPlugin extends EditorPlugin {
    /**
     * Register a callback to be invoked when format state of editor is changed, returns a disposer function.
     */
    registerFormatChangedCallback: (callback: (formatState: FormatState) => void) => () => void;

    /**
     * When user clicks on a button, call this method to let the plugin to handle this click event
     */
    onButtonClick: (button: RibbonButton) => void;
}
