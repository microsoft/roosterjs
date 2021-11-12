import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    Browser,
    clearSelectedTableCells,
    highlightTableSelection,
    setTableSelectedRange,
} from 'roosterjs-editor-dom';

/**
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements EditorPlugin {
    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private lastTarget: EventTarget;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableSelection';
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
        if (event.eventType == PluginEventType.BeforeSetContent) {
            this.clearTableCellSelection(true /** forceClear */);
            this.editor.select(this.editor.getElementAtCursor('td'));
        }
        if (event.eventType == PluginEventType.MouseUp && !this.mouseUpEventListerAdded) {
            if (event.isClicking && event.rawEvent.which != Keys.RIGHT_CLICK) {
                this.clearTableCellSelection(true /** forceClear */);
                return;
            }
        }
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);

            if (!event.rawEvent.shiftKey) {
                this.clearTableCellSelection();
                this.editor
                    .getDocument()
                    .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            }
            this.mouseUpEventListerAdded = true;
        } else if (!this.mouseUpEventListerAdded) {
            const range = this.editor?.getSelectionRange();
            if (range && !range.collapsed) {
                highlightTableSelection(
                    Browser.isFirefox
                        ? this.editor.getDocument().getSelection()
                        : this.editor.getSelectionTraverser()
                );
                return;
            }
            this.clearTableCellSelection();
        }
    }

    private clearTableCellSelection(forceClear?: boolean) {
        if (this.editor) {
            let range = this.editor.getSelectionRange();

            if (!range || range.collapsed || forceClear) {
                clearSelectedTableCells(this.editor);
            }
        }
    }

    private onMouseMove = (rawEvent: MouseEvent) => {
        if ((event.target && event.target != this.lastTarget) || Browser.isFirefox) {
            let range = this.editor.getSelectionRange();
            if (range) {
                if (!range.collapsed) {
                    highlightTableSelection(
                        Browser.isFirefox
                            ? this.editor.getDocument().getSelection()
                            : this.editor.getSelectionTraverser()
                    );
                } else {
                    const table = this.editor.getElementAtCursor('TABLE') as HTMLTableElement;
                    const td = this.editor.getElementAtCursor('TD') as HTMLTableCellElement;
                    if (table && td) {
                        setTableSelectedRange(table, td, null);
                    }
                }
            }
        }
        this.lastTarget = event.target;
    };

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };
}
