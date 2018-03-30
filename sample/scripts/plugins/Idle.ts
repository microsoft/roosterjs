import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

// An editor plugin to show the time when last Idle event was fired
export default class Idle implements EditorPlugin {

    constructor(private resultContainer: HTMLElement) {}

    public initialize(editor: Editor) {
    }

    public dispose() {
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.Idle) {
            this.resultContainer.innerText = new Date().toTimeString();
        }
    }
}
