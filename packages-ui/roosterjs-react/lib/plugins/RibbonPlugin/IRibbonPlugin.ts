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
     * @param button The button that is clicked
     * @key Key of child menu item that is clicked if any
     */
    onButtonClick: (button: RibbonButton, key?: string) => void;

    /**
     * Enter live preview state (shadow edit) of editor if there is a non-collapsed selection
     * @param button The button that triggered this action
     * @param key Key of the hovered button sub item
     */
    startLivePreview: (button: RibbonButton, key: string) => void;

    /**
     * Leave live preview state (shadow edit) of editor
     */
    stopLivePreview: () => void;
}
