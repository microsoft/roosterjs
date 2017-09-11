import { Editor } from 'roosterjs-core';

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