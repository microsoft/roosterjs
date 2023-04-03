import { createEditorCore } from './createEditorCore';
import { EditorBase } from './EditorBase';
import { EditorCore, EditorOptions } from 'roosterjs-editor-types';

/**
 * RoosterJs core editor class
 */
export default class Editor extends EditorBase<EditorCore, EditorOptions> {
    /**
     * Creates an instance of EditorBase
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        super(contentDiv, options, createEditorCore);
    }
}
