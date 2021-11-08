import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    Browser,
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
        if (event.eventType == PluginEventType.MouseUp) {
            if (event.isClicking && event.rawEvent.which != Keys.RIGHT_CLICK) {
                this.clearTableCellSelection(true /** isClicking */);
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
        } else {
            const range = this.editor?.getSelectionRange();
            if (range && !range.collapsed) {
                this.highlightSelection();
                return;
            }
            this.clearTableCellSelection();
        }
    }

    private clearTableCellSelection(isClicking: boolean = false) {
        if (this.editor) {
            let range = this.editor.getSelectionRange();

            if (!range || range.collapsed || isClicking) {
                clearSelectedTableCells(this.editor);
            }
        }
    }

    private onMouseMove = (rawEvent: MouseEvent) => {
        if ((event.target && event.target != this.lastTarget) || Browser.isFirefox) {
            let range = this.editor.getSelectionRange();
            if (range) {
                if (!range.collapsed) {
                    this.highlightSelection();
                } else {
                    const table = this.editor.getElementAtCursor('TABLE') as HTMLTableElement;
                    const td = this.editor.getElementAtCursor('TD') as HTMLTableCellElement;
                    if (table && td) {
                        this.setTableSelectedRange(table, td, null);
                    }
                }
            }
        }
        this.lastTarget = event.target;
    };

    highlightSelection = () => {
        let firstTDSelected: HTMLTableCellElement;
        let lastTDSelected: HTMLTableCellElement;
        let table: HTMLTableElement;

        if (Browser.isFirefox) {
            const selection = this.editor.getDocument().getSelection();

            for (let index = 0; index < selection.rangeCount; index++) {
                const range = selection.getRangeAt(index);
                const container = range.startContainer;
                if (getTagOfNode(container) == 'TR') {
                    let element = container.childNodes[range.startOffset] as HTMLElement;

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

                        if (index == selection.rangeCount - 1) {
                            this.setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                            break;
                        }
                    } else {
                        if (table) {
                            this.setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                        }
                    }
                }
            }
        } else {
            const range = this.editor.getSelectionTraverser();

            let currentElement = range.currentBlockElement;
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
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };
}
