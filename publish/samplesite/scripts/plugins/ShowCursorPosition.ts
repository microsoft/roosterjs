import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

// An editor plugin to show cursor position in demo page
export default class ShowCursorPosition implements EditorPlugin {
    private editor: Editor;

    constructor(private resultContainer: HTMLElement) {}

    public initialize(editor: Editor) {
        this.editor = editor;
    }

    public dispose() {
        this.editor = null;
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyUp || event.eventType == PluginEventType.MouseUp || event.eventType == PluginEventType.ContentChanged) {
            let rect = this.editor.getCursorRect();
            if (rect) {
                let result =
                    'top=' +
                    rect.top +
                    '; bottom=' +
                    rect.bottom +
                    '; left=' +
                    rect.left +
                    '; right=' +
                    rect.right;
                this.resultContainer.innerText = result;
            }
        }
    }
}
