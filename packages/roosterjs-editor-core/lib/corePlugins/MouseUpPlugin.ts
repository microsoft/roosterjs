import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    clearSelectedTableCells,
    findClosestElementAncestor,
    safeInstanceOf,
    VTable,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * MouseUpPlugin help trigger MouseUp event even when mouse up happens outside editor
 * as long as the mouse was pressed within Editor before
 */
export default class MouseUpPlugin implements EditorPlugin {
    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private mouseDownX: number;
    private mouseDownY: number;

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
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);

            clearSelectedTableCells(this.editor);
            this.mouseUpEventListerAdded = true;
            this.mouseDownX = event.rawEvent.pageX;
            this.mouseDownY = event.rawEvent.pageY;
            this.firstTDSelected = null;
        } else if (
            event.eventType != PluginEventType.MouseDown &&
            event.eventType != PluginEventType.MouseUp
        ) {
            clearSelectedTableCells(this.editor);
        }
    }

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
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

    private firstTDSelected: HTMLTableCellElement;
    private lastTDSelected: HTMLTableCellElement;
    private onMouseMove = (rawEvent: MouseEvent) => {
        if (this.editor) {
            const target = rawEvent.target;

            if (
                target &&
                safeInstanceOf(target, 'HTMLTableCellElement') &&
                target != this.lastTDSelected
            ) {
                if (!this.firstTDSelected) {
                    this.firstTDSelected = target;
                }
                const table = findClosestElementAncestor(
                    this.firstTDSelected,
                    null,
                    'Table'
                ) as HTMLTableElement;

                let vTable = new VTable(table);
                vTable.highlightSelection(this.firstTDSelected, target);
            }
        }
    };
}
