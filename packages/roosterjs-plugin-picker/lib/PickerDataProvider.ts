import { Editor } from 'roosterjs-editor-core';

export interface PickerPluginOptions {
    // Constant that defines the element ID prefix to look for.
    // If it matches, this element should be handled by the plugin
    elementIdPrefix: string;

    // Constant that defines the change source to be used when events are broadcasted.
    changeSource: string;

    // Constant that defines the character(s) that will trigger the suggesting state in the plugin.
    // The @mentions case, for instance, uses a '@' symbol.
    triggerCharacter: string;

    // Option for using the picker in the horizontal state:
    // Vertical (the default, when this is false), will call shiftHighlight with up (false) and down (true).
    // Horizontal (when this is true), will call shiftHighlight with left (false) and right (true).
    isHorizontal?: boolean;
}

export interface PickerDataProvider {
    // Function called when the plugin is intialized to register two callbacks with the data provider and a reference to the Editor.
    // The first is called in order to "commit" a new element to the editor body that isn't handled automatically by the editor plugin.
    // The second sets the isSuggesting value for situations wherethe UX needs to manipulate the suggesting state that's otherwise plugin managed.
    onInitalize: (
        commitMentionCallback: (nodeToAvoiddd: HTMLElement) => void,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor?: Editor
    ) => void;

    // Function called when the plugin is disposed for the data provider to do any cleanup.
    onDispose: () => void;

    // Function called when the picker changes suggesting state.
    onIsSuggestingChanged: (isSuggesting: boolean) => void;

    // Function called when the query string (text after the trigger symbol) is updated.
    queryStringUpdated: (queryString: string) => void;

    // Function called when a keypress is issued that would "select" a currently highlighted option.
    selectOption?: () => void;

    // Function called when a keypress is issued that would move the highlight on any picker UX.
    shiftHighlight?: (isIncrement: boolean) => void;

    // Function that is called when a delete command is issued.
    // Returns the intended replacement node (if partial delete) or null (if full delete)
    onRemove: (nodeRemoved: Node, isBackwards: boolean) => Node;

    // Function that returns the current cursor position as an anchor point for where to show UX.
    setCursorPoint?: (targetPoint: { x: number; y: number }, buffer: number) => void;
}
