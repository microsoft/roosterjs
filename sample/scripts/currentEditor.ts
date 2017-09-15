import { Editor } from 'roosterjs-editor-core';

let editor: Editor;

export default function getCurrentEditor(): Editor {
    return editor;
}

export function setCurrentEditor(newEditor: Editor) {
    if (editor) {
        editor.dispose();
    }
    editor = newEditor;
    editor.setContent('');
}