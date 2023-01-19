import IEditor from './IEditor';

/**
 * Data provider for PickerPlugin
 */
export default interface PickerDataProvider {
    // TODO: Rename to "onInitialize"
    /**
     * Function called when the plugin is initialized to register two callbacks with the
     * data provider and to provide a reference to the Editor. The first callback, insertNodeCallback,
     * may be called in order to "commit" a new element to the editor body that isn't handled
     * automatically by the editor plugin. The second callback, setIsSuggestingCallback, sets
     * the isSuggesting value in the plugin. The isSuggesting value determines whether the picker
     * is shown (true) or hidden (false). In most cases, this value is managed by the plugin, but
     * the setIsSuggestingCallback may be used for situations where the UX needs to manipulate the
     * suggesting state on its own.
     */
    onInitalize: (
        insertNodeCallback: (nodeToInsert: HTMLElement) => void,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor?: IEditor
    ) => void;

    /**
     * Function called when the plugin is disposed for the data provider to do any cleanup.
     */
    onDispose: () => void;

    /**
     * Function called when the picker changes suggesting state
     * (isSuggesting - true: Plugin is being shown; false: Plugin is being hidden).
     */
    onIsSuggestingChanged: (isSuggesting: boolean) => void;

    /**
     * Function called when the query string (text after the trigger symbol) is updated.
     */
    queryStringUpdated: (queryString: string, isExactMatch: boolean) => void;

    /**
     * Function called when a keypress is issued that would "select" a currently highlighted option.
     */
    selectOption?: () => void;

    /**
     * Function called when a keypress is issued that would move the highlight on any picker UX.
     */
    shiftHighlight?: (isIncrement: boolean) => void;

    /**
     * Function that is called when a delete command is issued.
     * Returns the intended replacement node (if partial delete) or null (if full delete)
     */
    onRemove: (nodeRemoved: Node, isBackwards: boolean) => Node | null;

    /**
     * Function that is called by the plugin to set the current cursor position as an
     * anchor point for where to show UX.
     */
    setCursorPoint?: (targetPoint: { x: number; y: number }, buffer: number) => void;

    /**
     * Function that is called when the plugin detects the editor's content has changed.
     * Provides a list of current picker placed elements in the document.
     */
    onContentChanged?: (elementIds: string[]) => void;

    /**
     * Function that returns the index of the option currently selected in the picker.
     */
    getSelectedIndex?: () => number;

    /**
     * Handler of scroll event from scroll container of editor
     */
    onScroll?: (scrollContainer: HTMLElement) => void;
}
