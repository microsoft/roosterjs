import { createEditor } from 'roosterjs';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const KEY_0 = 0x30;
const KEY_9 = 0x39;

// This plugin will insert an English word when user is inputting numbers
class MyPlugin implements EditorPlugin {
    private editor: Editor;

    getName() {
        return 'MyPlugin';
    }

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyPress) {
            let keyboardEvent = event.rawEvent;
            if (keyboardEvent.which >= KEY_0 && keyboardEvent.which <= KEY_9) {
                let text = NUMBERS[keyboardEvent.which - KEY_0] + ' ';
                this.editor.insertContent(text);
                keyboardEvent.preventDefault();
            }
        }
    }
}

let contentDiv = document.getElementById('contentDiv') as HTMLDivElement;
let myPlugin = new MyPlugin();
let editor = createEditor(contentDiv, [myPlugin]);
