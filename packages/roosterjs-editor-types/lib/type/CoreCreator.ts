import EditorCore from '../interface/EditorCore';
import EditorOptions from '../interface/EditorOptions';

/**
 * Type of Editor Core Creator
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param options An optional options object to customize the editor
 */
export type CoreCreator<TEditorCore extends EditorCore, TEditorOptions extends EditorOptions> = (
    contentDiv: HTMLDivElement,
    options: TEditorOptions
) => TEditorCore;
