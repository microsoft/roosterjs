import getLastClipboardData from './getLastClipboardData';
import Ribbon from './Ribbon';
import { ChangeSource, ClipboardData, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';

export default class RibbonPlugin implements EditorPlugin {
    editor: Editor;
    ribbon: Ribbon;

    getName() {
        return 'Ribbon';
    }

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getEditor() {
        return this.editor;
    }

    refCallback = (ref: Ribbon) => {
        this.ribbon = ref;
    };

    onPluginEvent(event: PluginEvent) {
        if (this.ribbon) {
            if (
                event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.MouseUp
            ) {
                const wrapper = getLastClipboardData(this.editor);
                wrapper.data = null;
                this.ribbon.forceUpdate();
            } else if (event.eventType == PluginEventType.ContentChanged) {
                const wrapper = getLastClipboardData(this.editor);
                if (event.source == ChangeSource.Paste) {
                    wrapper.data = event.data as ClipboardData;
                } else {
                    wrapper.data = null;
                }
                this.ribbon.forceUpdate();
            } else if (event.eventType == PluginEventType.EditorReady) {
                this.ribbon.forceUpdate();
            }
        }
    }
}
