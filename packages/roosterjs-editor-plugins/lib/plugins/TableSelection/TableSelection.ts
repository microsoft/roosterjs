import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    clearSelectedTableCells,
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    VTable,
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
        if (event.eventType == PluginEventType.MouseUp && event.isClicking) {
            this.clearTableCellSelection();
            return;
        }
        if (
            event.eventType == PluginEventType.MouseDown &&
            !event.rawEvent.shiftKey &&
            !this.mouseUpEventListerAdded
        ) {
            this.clearTableCellSelection();
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            this.mouseUpEventListerAdded = true;
        } else {
            if (event.eventType == PluginEventType.KeyDown && event.rawEvent.shiftKey) {
                if (event.rawEvent.which != Keys.SHIFT) {
                    setTimeout(() => this.highlightSelection(), 5);
                }
            }

            if (event.eventType == PluginEventType.MouseDown && event.rawEvent.shiftKey) {
                console.log(event);
                setTimeout(() => this.highlightSelection(), 0);
            }
            this.clearTableCellSelection();
        }
    }

    private clearTableCellSelection() {
        if (this.editor) {
            let range = this.editor.getSelectionRange();
            if (!range || range.collapsed) {
                clearSelectedTableCells(this.editor);
            }
        }
    }

    private onMouseMove = (rawEvent: MouseEvent) => {
        if (event.target && event.target != this.lastTarget) {
            let range = this.editor.getSelectionRange();
            if (range && !range.collapsed) {
                this.highlightSelection();
            }
        }
        this.lastTarget = event.target;
    };

    highlightSelection = () => {
        clearSelectedTableCells(this.editor);
        const range = this.editor.getSelectionTraverser();

        let firstTDSelected: HTMLTableCellElement;
        let lastTDSelected: HTMLTableCellElement;

        let currentElement = range.currentBlockElement;
        let table: HTMLTableElement;
        while (range.currentBlockElement) {
            currentElement = range.currentBlockElement;
            range.getNextBlockElement();

            let element = currentElement.collapseToSingleElement();

            if (getTagOfNode(element) != 'TD') {
                element = findClosestElementAncestor(element, null, 'td');
            }
            if (element && safeInstanceOf(element, 'HTMLTableCellElement')) {
                let tempTable = findClosestElementAncestor(
                    element,
                    null,
                    'table'
                ) as HTMLTableElement;

                if (tempTable && tempTable != table) {
                    table = tempTable;
                    firstTDSelected = element;
                } else {
                    lastTDSelected = element;
                }

                if (range.currentBlockElement == currentElement) {
                    this.setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                    break;
                }
            } else {
                if (table) {
                    this.setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                }
            }

            if (range.currentBlockElement == currentElement) {
                break;
            }
        }
    };

    setTableSelectedRange = (
        table: HTMLTableElement,
        firstTDSelected: HTMLTableCellElement,
        lastTDSelected: HTMLTableCellElement
    ) => {
        if (firstTDSelected && !lastTDSelected) {
            lastTDSelected = firstTDSelected;
        }

        let vTable = new VTable(table);
        vTable.highlightSelection(firstTDSelected, lastTDSelected);
    };

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, false);
        }
    }

    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };
}
