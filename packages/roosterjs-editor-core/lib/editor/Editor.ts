import { EditorBase } from './EditorBase';
import { EditorOptions } from 'roosterjs-editor-types';

/**
 * RoosterJs core editor class
 */
export default class Editor extends EditorBase {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        super(contentDiv, options);
    }
}
