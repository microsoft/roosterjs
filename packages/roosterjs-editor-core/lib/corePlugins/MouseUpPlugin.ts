import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * @internal
 * MouseUpPlugin help trigger MouseUp event even when mouse up happens outside editor
 * as long as the mouse was pressed within Editor before
 */
export default class MouseUpPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private mouseUpEventListerAdded: boolean = false;
    private mouseDownX: number | null = null;
    private mouseDownY: number | null = null;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'MouseUp';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.removeMouseUpEventListener();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            this.editor &&
            event.eventType == PluginEventType.MouseDown &&
            !this.mouseUpEventListerAdded
        ) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
            this.mouseUpEventListerAdded = true;
            this.mouseDownX = event.rawEvent.pageX;
            this.mouseDownY = event.rawEvent.pageY;
        }
    }
    private removeMouseUpEventListener() {
        if (this.editor && this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerPluginEvent(PluginEventType.MouseUp, {
                rawEvent,
                isClicking: this.mouseDownX == rawEvent.pageX && this.mouseDownY == rawEvent.pageY,
            });
        }
    };
}
