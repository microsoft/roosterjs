import { EditorOptions, IEditor } from 'roosterjs-editor-types';

/**
 * Properties for Rooster react component
 */
export default interface RoosterProps {
    /**
     * DOM attributes for the DIV tag of editor. All properties passed in from this property will be
     * rendered as DOM attribute of the editor DIV node.
     * Changing of these attributes after editor is created can impact the DOM element, but it will not reset editor
     */
    domAttributes?: React.HTMLAttributes<HTMLDivElement>;

    /**
     * Options used for creating roosterjs editor
     * Changing of these options after editor is created will not reset editor
     */
    editorOptions?: EditorOptions;

    /**
     * Creator function used for creating the instance of roosterjs editor.
     * Use this callback when you have your own sub class of roosterjs Editor or force trigging a reset of editor
     */
    editorCreator?: (div: HTMLDivElement, options: EditorOptions) => IEditor;

    /**
     * Whether editor should get focus once it is created
     * Changing of this value after editor is created will not reset editor
     */
    focusOnInit?: boolean;
}
