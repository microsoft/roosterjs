import type { OnNodeCreated } from 'roosterjs-content-model-types';

/**
 * Options for PickerPlugin
 */
export interface PickerPluginOptions {
    /**
     * Constant that defines the element ID prefix to look for.
     * If it matches, this element should be handled by the plugin
     */
    elementIdPrefix: string;

    /**
     * When apply the selected item in picker, a ContentChangedEvent will be broadcasted.
     * This value will be used as the ChangeSource of this event.
     */
    changeSource: string;

    /**
     * Constant that defines the character(s) that will trigger the suggesting state in the plugin.
     */
    triggerCharacter: string;

    /**
     * Option for using the picker in the horizontal state:
     * Vertical (the default, when this is false), will call shiftHighlight with up (false) and down (true).
     * Horizontal (when this is true), will call shiftHighlight with left (false) and right (true).
     */
    isHorizontal?: boolean;

    /**
     * Whether handle keyboard in RTL
     */
    isRightToLeft?: boolean;

    /**
     * When apply the selected item in picker, perform as an auto-complete behavior (can be undone by BACKSPACE key)
     * if this option is set to true
     */
    handleAutoComplete?: boolean;

    /**
     * Constant that defines the ID label for the picker.
     * Used for setting the ariaOwns attribute of the editor when a picker is open.
     */
    suggestionsLabel?: string;

    /**
     * Constant that defines the prefix of the ID label for the picker's options.
     * Used for setting the ariaActiveDescendant attribute of the editor when a picker option is selected.
     */
    suggestionLabelPrefix?: string;

    /**
     * An optional callback that will be called when a DOM node is created
     * @param modelElement The related Content Model element
     * @param node The node created for this model element
     */
    onNodeCreated?: OnNodeCreated;
}
