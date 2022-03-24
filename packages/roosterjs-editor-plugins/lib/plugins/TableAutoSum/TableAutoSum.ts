import { setColor } from 'roosterjs-editor-dom/lib';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    TableAutoSumProperties,
} from 'roosterjs-editor-types';

const TABLE_CELL_SELECTOR = 'td,th';
interface TotalCells {
    rowTotal: HTMLElement;
    columnTotal: HTMLElement;
}

/**
 * TableAutoSumPlugin help highlight table cells
 */
export default class TableAutoSumPlugin implements EditorPlugin {
    private editor: IEditor;
    private originalValue: string;
    private newValue: string;
    private typed: boolean;
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableAutoSum';
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
        this.editor = null;
        this.newValue = null;
        this.originalValue = null;
        this.typed = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            const cell = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR
            ) as HTMLTableCellElement;
            if (
                !cell ||
                (!cell.dataset[TableAutoSumProperties.AutoSumRowId] &&
                    !cell.dataset[TableAutoSumProperties.AutoSumTotalRowId] &&
                    !cell.dataset[TableAutoSumProperties.AutoSumColumnId] &&
                    !cell.dataset[TableAutoSumProperties.AutoSumTotalColumnId])
            ) {
                return;
            }

            const totalCell = getTotalCells(this.editor, cell);
            const summedCells = getSummedCells(this.editor, cell);
            switch (event.eventType) {
                case PluginEventType.MouseUp:
                    highlightCells(this.editor, summedCells, totalCell);
                    this.originalValue = cell.textContent === '' ? '0' : cell.textContent;
                    break;
                case PluginEventType.Input:
                    this.typed = true;
                    this.newValue = cell.textContent === '' ? '0' : cell.textContent;
                    break;
                case PluginEventType.MouseDown:
                    removeHighlight(this.editor, summedCells, totalCell);
                    if (!this.typed) {
                        return;
                    }
                    this.editor.addUndoSnapshot(() => {
                        autoSum(totalCell, this.originalValue, this.newValue);
                    });

                    this.typed = false;
                    break;
            }
        }
    }
}

function autoSum(totalCell: TotalCells, originalValue: string, newValue: string) {
    const { rowTotal, columnTotal } = totalCell;
    if (rowTotal) {
        const total = rowTotal.textContent;
        const result = parseFloat(total) - parseFloat(originalValue) + parseFloat(newValue);
        rowTotal.textContent = result.toString();
    }
    if (columnTotal) {
        const total = columnTotal.textContent;
        const result = parseFloat(total) - parseFloat(originalValue) + parseFloat(newValue);
        columnTotal.textContent = result.toString();
    }
}

function getTotalCells(editor: IEditor, cell: HTMLTableCellElement): TotalCells {
    const doc = editor.getDocument();
    const rowId =
        cell.dataset[TableAutoSumProperties.AutoSumRowId] ||
        cell.dataset[TableAutoSumProperties.AutoSumTotalRowId];
    const columnId =
        cell.dataset[TableAutoSumProperties.AutoSumColumnId] ||
        cell.dataset[TableAutoSumProperties.AutoSumTotalColumnId];
    const rowTotal = doc.querySelector(
        `[data-${TableAutoSumProperties.AutoSumTotalRowId}~="${rowId}"]`
    ) as HTMLElement;
    const columnTotal = doc.querySelector(
        `[data-${TableAutoSumProperties.AutoSumTotalColumnId}~="${columnId}"]`
    ) as HTMLElement;
    return { rowTotal, columnTotal };
}

function getSummedCells(editor: IEditor, cell: HTMLTableCellElement) {
    const doc = editor.getDocument();
    const rowId =
        cell.dataset[TableAutoSumProperties.AutoSumRowId] ||
        cell.dataset[TableAutoSumProperties.AutoSumTotalRowId];
    const columnId =
        cell.dataset[TableAutoSumProperties.AutoSumColumnId] ||
        cell.dataset[TableAutoSumProperties.AutoSumTotalColumnId];
    return doc.querySelectorAll(
        `[data-${TableAutoSumProperties.AutoSumColumnId}~="${columnId}"], [data-${TableAutoSumProperties.AutoSumRowId}~="${rowId}"]`
    );
}

function highlightCells(editor: IEditor, summedCells: NodeListOf<Element>, totalCell: TotalCells) {
    summedCells.forEach((item, index) => {
        const cell = item as HTMLElement;
        cell.dataset[TableAutoSumProperties.AutoSumCellOriginalColor] = cell.style.backgroundColor;
        setColor(cell, '#bcf5bc', true, editor.isDarkMode());
    });
    const { rowTotal, columnTotal } = totalCell;
    if (rowTotal) {
        rowTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor] =
            rowTotal.style.backgroundColor;
        setColor(rowTotal as HTMLElement, '#90ee90', true, editor.isDarkMode());
    }
    if (columnTotal) {
        columnTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor] =
            columnTotal.style.backgroundColor;
        setColor(columnTotal as HTMLElement, '#90ee90', true, editor.isDarkMode());
    }
}

function removeHighlight(editor: IEditor, summedCells: NodeListOf<Element>, totalCell: TotalCells) {
    summedCells.forEach((item, index) => {
        const cell = item as HTMLElement;
        const color = cell.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        if (color) {
            setColor(cell, color, true, editor.isDarkMode());
            delete cell.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        }
    });
    const { rowTotal, columnTotal } = totalCell;
    if (rowTotal) {
        const rowTotalColor = rowTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        if (rowTotalColor) {
            setColor(rowTotal, rowTotalColor, true, editor.isDarkMode());
            delete rowTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        }
    }
    if (columnTotal) {
        const columnTotalColor =
            columnTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        if (columnTotal) {
            setColor(columnTotal, columnTotalColor, true, editor.isDarkMode());
            delete columnTotal.dataset[TableAutoSumProperties.AutoSumCellOriginalColor];
        }
    }
}
