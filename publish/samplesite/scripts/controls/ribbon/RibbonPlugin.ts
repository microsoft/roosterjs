import { Editor, EditorPlugin } from 'roosterjs-editor-core';

export default class RibbonPlugin implements EditorPlugin {
    editor: Editor;

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getEditor() {
        return this.editor;
    }
}
