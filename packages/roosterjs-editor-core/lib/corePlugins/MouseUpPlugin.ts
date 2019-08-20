import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * MouseUp Component helps handle mouse up event
 * this can trigger mouse up event after mousedown happens in editor
 * even mouse up is happening outside editor
 */
export default class MouseUpPlugin implements EditorPlugin {
    private mouseUpEventListerAdded: boolean;
    private editor: Editor;

    getName() {
        return 'MouseUp';
    }

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.removeMouseUpEventListener();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
            this.mouseUpEventListerAdded = true;
        }
    }

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerPluginEvent(PluginEventType.MouseUp, {
                rawEvent,
            });
        }
    };
}
