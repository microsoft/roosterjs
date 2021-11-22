import {
    BeforeCutCopyEvent,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    Browser,
    clearSelectedTableCells,
    highlightTableSelection,
    setTableSelectedRange,
    TableMetadata,
} from 'roosterjs-editor-dom';

/**
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements EditorPlugin {
    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private lastTarget: EventTarget;
    private firstTarget: EventTarget;

    private mouseDownX: number;
    private mouseDownY: number;

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
        const prevElement = this.editor?.getDocument().getElementById('Style4TableSelection');
        if (!prevElement) {
            const styleElement = document.createElement('style');
            styleElement.id = 'Style4TableSelection';
            this.editor.getDocument().head.append(styleElement);

            let sheet = styleElement.sheet;
            sheet.insertRule(
                `td.${TableMetadata.TABLE_CELL_NOT_SELECTED} *::selection { background-color: transparent !important;}`
            );

            sheet.insertRule(
                `td.${TableMetadata.TABLE_CELL_NOT_SELECTED}::selection { background-color: transparent !important;}`
            );
        }
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.removeMouseUpEventListener();
        clearSelectedTableCells(this.editor);

        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.BeforeCutCopy) {
            this.handleBeforeCutCopy(event);
        }

        if (event.eventType == PluginEventType.BeforeSetContent) {
            this.clearTableCellSelection(true /* forceClear */);
            return;
        }
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
            this.clearTableCellSelection();

            if (!event.rawEvent.shiftKey) {
                this.editor
                    .getDocument()
                    .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            }
            this.mouseDownX = event.rawEvent.pageX;
            this.mouseDownY = event.rawEvent.pageY;
            this.mouseUpEventListerAdded = true;
        } else if (
            !this.mouseUpEventListerAdded ||
            (event.eventType == PluginEventType.MouseUp && event.isClicking)
        ) {
            const range = this.editor?.getSelectionRange();
            if (
                range &&
                range.commonAncestorContainer.nodeType != Node.TEXT_NODE &&
                !range.collapsed
            ) {
                highlightTableSelection(
                    Browser.isFirefox
                        ? this.editor.getDocument().getSelection()
                        : this.editor.getSelectionTraverser()
                );
                return;
            }
            this.clearTableCellSelection();
        }

        if (event.eventType == PluginEventType.MouseUp && event.isClicking) {
            this.clearTableCellSelection(true /* forceClear */);
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

    private onMouseMove = (event: MouseEvent) => {
        if (
            event.target &&
            this.lastTarget &&
            event.target != this.lastTarget &&
            event.target != this.firstTarget
        ) {
            clearSelectedTableCells(this.editor);
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
            } else if (event.target == this.firstTarget) {
                clearSelectedTableCells(this.editor);
            }
        }
        this.firstTarget = this.firstTarget || event.target;
        this.lastTarget = event.target;
    };

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.lastTarget = null;
            this.firstTarget = null;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

    private onMouseUp = (rawEvent: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            if (this.mouseDownX == rawEvent.pageX && this.mouseDownY == rawEvent.pageY) {
                setTimeout(() => {
                    this.clearTableCellSelection();
                }, 50);
            }
        }
    };

    private handleBeforeCutCopy(event: BeforeCutCopyEvent) {
        event.clonedRoot
            .querySelectorAll('td.' + TableMetadata.TABLE_CELL_NOT_SELECTED)
            .forEach(cell => {
                if (cell.parentNode) {
                    cell.parentNode.removeChild(cell);
                }
            });
    }
}
