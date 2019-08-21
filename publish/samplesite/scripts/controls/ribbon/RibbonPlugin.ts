import Ribbon from './Ribbon';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

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
        if (
            this.ribbon &&
            (event.eventType == PluginEventType.KeyUp ||
                event.eventType == PluginEventType.MouseUp ||
                event.eventType == PluginEventType.ContentChanged)
        ) {
            this.ribbon.forceUpdate();
        }
    }
}
