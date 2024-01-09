import ContentModelRibbonButton from './ContentModelRibbonButton';
import { EditorPlugin } from 'roosterjs-content-model-types';
import { LocalizedStrings, UIUtilities } from 'roosterjs-react';
import type { FormatState } from 'roosterjs-editor-types';

/**
 * Represents a plugin to connect format ribbon component and the editor
 */
export default interface RibbonPlugin extends EditorPlugin {
    /**
     * Set the UI utilities objects to this plugin to help render additional UI elements
     * @param uiUtilities The UI utilities object to set
     */
    setUIUtilities(uiUtilities: UIUtilities): void;

    /**
     * Register a callback to be invoked when format state of editor is changed, returns a disposer function.
     */
    registerFormatChangedCallback: (callback: (formatState: FormatState) => void) => () => void;

    /**
     * When user clicks on a button, call this method to let the plugin to handle this click event
     * @param button The button that is clicked
     * @param key Key of child menu item that is clicked if any
     * @param strings The localized string map for this button
     */
    onButtonClick: <T extends string>(
        button: ContentModelRibbonButton<T>,
        key: T,
        strings?: LocalizedStrings<T>
    ) => void;

    /**
     * Enter live preview state (shadow edit) of editor if there is a non-collapsed selection
     * @param button The button that triggered this action
     * @param key Key of the hovered button sub item
     * @param strings The localized string map for this button
     */
    startLivePreview: <T extends string>(
        button: ContentModelRibbonButton<T>,
        key: T,
        strings?: LocalizedStrings<T>
    ) => void;

    /**
     * Leave live preview state (shadow edit) of editor
     */
    stopLivePreview: () => void;
}
