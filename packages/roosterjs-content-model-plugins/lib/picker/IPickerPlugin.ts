import { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Interface for PickerPlugin
 */
export interface IPickerPlugin {
    commit: (nodeToInsert: ContentModelDocument) => void;

    setIsSuggesting: (isSuggesting: boolean) => void;

    /**
     * Function called when the picker changes suggesting state
     * (isSuggesting - true: Plugin is being shown; false: Plugin is being hidden).
     */
    onIsSuggestingChanged?: (isSuggesting: boolean) => void;

    /**
     * Function called when the query string (text after the trigger symbol) is updated.
     */
    onQueryStringUpdated?: (queryString: string) => void;

    /**
     * Function called when a keypress is issued that would "select" a currently highlighted option.
     */
    selectOption?: () => void;

    /**
     * Function called when a keypress is issued that would move the highlight on any picker UX.
     */
    shiftHighlight?: (isIncrement: boolean) => void;

    /**
     * Function that is called by the plugin to set the current cursor position as an
     * anchor point for where to show UX.
     */
    setCursorPoint?: (targetPoint: { x: number; y: number }, buffer: number) => void;

    /**
     * Function that returns the index of the option currently selected in the picker.
     */
    getSelectedIndex?: () => number;
}
