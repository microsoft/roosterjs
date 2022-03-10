import { EditorOptions, IEditor } from 'roosterjs-editor-types';

/**
 * Properties for Rooster react component
 */
export default interface RoosterProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
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
