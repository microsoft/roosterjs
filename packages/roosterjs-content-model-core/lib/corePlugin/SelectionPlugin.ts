import { findTableCellElement, parseTableCells } from '../publicApi/domUtils/tableCellUtils';
import { isCharacterValue, isModifierKey } from '../publicApi/domUtils/eventUtils';
import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { normalizePos } from '../publicApi/domUtils/normalizePos';
import type {
    DOMSelection,
    IEditor,
    PluginEvent,
    PluginWithState,
    SelectionPluginState,
    EditorOptions,
    DOMHelper,
    MouseUpEvent,
    ParsedTable,
} from 'roosterjs-content-model-types';

const MouseLeftButton = 0;
const MouseMiddleButton = 1;
const MouseRightButton = 2;
const TableCellSelector = 'TH,TD';
const Up = 'ArrowUp';
const Down = 'ArrowDown';
const Left = 'ArrowLeft';
const Right = 'ArrowRight';

interface TableSelectionInfo {
    table: HTMLTableElement;
    parsedTable: ParsedTable;
    firstCo: [number, number];
    lastCo?: [number, number];
}

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: IEditor | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;
    private mouseDisposer: (() => void) | null = null;
    private isSafari = false;
    private isMac = false;
    private tableSelection: TableSelectionInfo | null = null;

    constructor(options: EditorOptions) {
        this.state = {
            selection: null,
            imageSelectionBorderColor: options.imageSelectionBorderColor,
        };
    }

    getName() {
        return 'Selection';
    }

    initialize(editor: IEditor) {
        this.editor = editor;

        const env = this.editor.getEnvironment();
        const document = this.editor.getDocument();

        this.isSafari = !!env.isSafari;
        this.isMac = !!env.isMac;

        if (this.isSafari) {
            document.addEventListener('selectionchange', this.onSelectionChangeSafari);
            this.disposer = this.editor.attachDomEvent({
                focus: { beforeDispatch: this.onFocus },
                drop: { beforeDispatch: this.onDrop },
            });
        } else {
            this.disposer = this.editor.attachDomEvent({
                focus: { beforeDispatch: this.onFocus },
                blur: { beforeDispatch: this.onBlur },
                drop: { beforeDispatch: this.onDrop },
            });
        }
    }

    dispose() {
        this.editor
            ?.getDocument()
            .removeEventListener('selectionchange', this.onSelectionChangeSafari);

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        this.detachMouseEvent();
        this.editor = null;
    }

    getState(): SelectionPluginState {
        return this.state;
    }

    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'mouseDown':
                this.onMouseDown(this.editor, event.rawEvent);
                break;

            case 'mouseUp':
                this.onMouseUp(event);
                break;

            case 'keyDown':
                this.onKeyDown(this.editor, event.rawEvent);
                break;

            case 'contentChanged':
                this.tableSelection = null;
                break;
        }
    }

    private onMouseDown(editor: IEditor, rawEvent: MouseEvent) {
        const selection = editor.getDOMSelection();
        let image: HTMLImageElement | null;

        // Image selection
        if (
            rawEvent.button === MouseRightButton &&
            (image =
                this.getClickingImage(rawEvent) ??
                this.getContainedTargetImage(rawEvent, selection)) &&
            image.isContentEditable
        ) {
            this.selectImage(image);

            return;
        } else if (selection?.type == 'image' && selection.image !== rawEvent.target) {
            this.selectBeforeImage(editor, selection.image);

            return;
        }

        // Table selection
        if (selection?.type == 'table' && rawEvent.button == MouseLeftButton) {
            this.setDOMSelection(null /*domSelection*/, null /*tableSelection*/);
        }

        let tableSelection: TableSelectionInfo | null;
        const target = rawEvent.target as Node;

        if (
            rawEvent.button == MouseLeftButton &&
            (tableSelection = this.parseTableSelection(target, target, editor.getDOMHelper()))
        ) {
            this.tableSelection = tableSelection;
            this.mouseDisposer = editor.attachDomEvent({
                mousemove: {
                    beforeDispatch: this.onMouseMove,
                },
            });
        }
    }

    private onMouseMove = (event: Event) => {
        if (
            !this.editor ||
            !this.tableSelection ||
            (event as MouseEvent).button != MouseLeftButton
        ) {
            return;
        }

        let lastCo: [number, number] | null;

        if (
            (lastCo = this.findCoordinate(
                this.tableSelection.parsedTable,
                event.target as Node,
                this.editor.getDOMHelper()
            )) &&
            this.updateTableSelection(lastCo)
        ) {
            event.preventDefault();
        }
    };

    private onMouseUp(event: MouseUpEvent) {
        let image: HTMLImageElement | null;

        if (
            (image = this.getClickingImage(event.rawEvent)) &&
            image.isContentEditable &&
            event.rawEvent.button != MouseMiddleButton &&
            (event.rawEvent.button ==
                MouseRightButton /* it's not possible to drag using right click */ ||
                event.isClicking)
        ) {
            this.selectImage(image);
        }

        this.detachMouseEvent();
    }

    private onDrop = () => {
        this.detachMouseEvent();
    };

    private onKeyDown(editor: IEditor, rawEvent: KeyboardEvent) {
        const key = rawEvent.key;
        const selection = editor.getDOMSelection();

        switch (selection?.type) {
            case 'image':
                if (!isModifierKey(rawEvent) && !rawEvent.shiftKey && selection.image.parentNode) {
                    if (key === 'Escape') {
                        this.selectBeforeImage(editor, selection.image);
                        rawEvent.stopPropagation();
                    } else if (key !== 'Delete' && key !== 'Backspace') {
                        this.selectBeforeImage(editor, selection.image);
                    }
                }
                break;

            case 'table':
                if (this.tableSelection?.lastCo) {
                    const { shiftKey, key } = rawEvent;

                    if (shiftKey && (key == Left || key == Right)) {
                        const win = editor.getDocument().defaultView;
                        const isRtl =
                            win?.getComputedStyle(this.tableSelection.table).direction == 'rtl';

                        this.updateTableSelectionFromKeyboard(
                            0,
                            (key == Left ? -1 : 1) * (isRtl ? -1 : 1)
                        );
                        rawEvent.preventDefault();
                    } else if (shiftKey && (key == Up || key == Down)) {
                        this.updateTableSelectionFromKeyboard(key == Up ? -1 : 1, 0);
                        rawEvent.preventDefault();
                    } else if (key != 'Shift' && !isCharacterValue(rawEvent)) {
                        if (key == Up || key == Down || key == Left || key == Right) {
                            this.setDOMSelection(null /*domSelection*/, this.tableSelection);
                            editor
                                .getDocument()
                                .defaultView?.requestAnimationFrame(() =>
                                    this.handleSelectionInTable(key)
                                );
                        }
                    }
                }
                break;

            case 'range':
                if (key == Up || key == Down || key == Left || key == Right) {
                    const start = selection.range.startContainer;
                    this.tableSelection = this.parseTableSelection(
                        start,
                        start,
                        editor.getDOMHelper()
                    );

                    if (this.tableSelection) {
                        editor
                            .getDocument()
                            .defaultView?.requestAnimationFrame(() =>
                                this.handleSelectionInTable(key)
                            );
                    }
                }
                break;
        }
    }

    private handleSelectionInTable(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
        if (!this.editor || !this.tableSelection) {
            return;
        }

        const selection = this.editor.getDOMSelection();
        const domHelper = this.editor.getDOMHelper();

        if (selection?.type == 'range') {
            const {
                range: { collapsed, startContainer, endContainer, commonAncestorContainer },
                isReverted,
            } = selection;
            const start = isReverted ? endContainer : startContainer;
            const end: Node | null = isReverted ? startContainer : endContainer;
            const tableSel = this.parseTableSelection(commonAncestorContainer, start, domHelper);

            if (tableSel) {
                let lastCo = this.findCoordinate(tableSel?.parsedTable, end, domHelper);

                if (
                    lastCo &&
                    (key == Up || key == Down) &&
                    tableSel.table == this.tableSelection.table &&
                    lastCo[1] != this.tableSelection.firstCo[1]
                ) {
                    const { parsedTable, firstCo: oldCo } = this.tableSelection;
                    const change = key == Up ? -1 : 1;
                    const originalTd = findTableCellElement(parsedTable, oldCo[0], oldCo[1]);
                    let td: HTMLTableCellElement | null = null;

                    lastCo = [oldCo[0] + change, oldCo[1]];

                    while (lastCo[0] >= 0 && lastCo[0] < parsedTable.length) {
                        td = findTableCellElement(parsedTable, lastCo[0], lastCo[1]);

                        if (td == originalTd) {
                            lastCo[0] += change;
                        } else {
                            break;
                        }
                    }

                    if (collapsed && td) {
                        const { node, offset } = normalizePos(
                            td,
                            key == Up ? td.childNodes.length : 0
                        );
                        const range = this.editor.getDocument().createRange();

                        range.setStart(node, offset);
                        range.collapse(true /*toStart*/);

                        this.setDOMSelection(
                            {
                                type: 'range',
                                range,
                                isReverted: false,
                            },
                            null /*tableSelection*/
                        );
                    }
                }

                if (!collapsed && lastCo) {
                    this.tableSelection = tableSel;
                    this.updateTableSelection(lastCo);
                }
            }
        }
    }

    private updateTableSelectionFromKeyboard(rowChange: number, colChange: number) {
        if (this.tableSelection?.lastCo && this.editor) {
            const { lastCo, parsedTable } = this.tableSelection;
            const row = lastCo[0] + rowChange;
            const col = lastCo[1] + colChange;

            if (row >= 0 && row < parsedTable.length && col >= 0 && col < parsedTable[row].length) {
                this.updateTableSelection([row, col]);
            }
        }
    }

    private selectImage(image: HTMLImageElement) {
        this.setDOMSelection(
            {
                type: 'image',
                image: image,
            },
            null /*tableSelection*/
        );
    }

    private selectBeforeImage(editor: IEditor, image: HTMLImageElement) {
        const doc = editor.getDocument();
        const parent = image.parentNode;
        const index = parent && toArray(parent.childNodes).indexOf(image);

        if (parent && index !== null && index >= 0) {
            const range = doc.createRange();
            range.setStart(parent, index);
            range.collapse();

            this.setDOMSelection(
                {
                    type: 'range',
                    range: range,
                    isReverted: false,
                },
                null /*tableSelection*/
            );
        }
    }

    private getClickingImage(event: UIEvent): HTMLImageElement | null {
        const target = event.target as Node;

        return isNodeOfType(target, 'ELEMENT_NODE') && isElementOfType(target, 'img')
            ? target
            : null;
    }

    // MacOS will not create a mouseUp event if contextMenu event is not prevent defaulted.
    // Make sure we capture image target even if image is wrapped
    private getContainedTargetImage = (
        event: MouseEvent,
        previousSelection: DOMSelection | null
    ): HTMLImageElement | null => {
        if (!this.isMac || !previousSelection || previousSelection.type !== 'image') {
            return null;
        }

        const target = event.target as Node;
        if (
            isNodeOfType(target, 'ELEMENT_NODE') &&
            isElementOfType(target, 'span') &&
            target.firstChild === previousSelection.image
        ) {
            return previousSelection.image;
        }
        return null;
    };

    private onFocus = () => {
        if (!this.state.skipReselectOnFocus && this.state.selection) {
            this.setDOMSelection(this.state.selection, this.tableSelection);
        }

        if (this.state.selection?.type == 'range' && !this.isSafari) {
            // Editor is focused, now we can get live selection. So no need to keep a selection if the selection type is range.
            this.state.selection = null;
        }
    };

    private onBlur = () => {
        if (!this.state.selection && this.editor) {
            this.state.selection = this.editor.getDOMSelection();
        }
    };

    private onSelectionChangeSafari = () => {
        if (this.editor?.hasFocus() && !this.editor.isInShadowEdit()) {
            // Safari has problem to handle onBlur event. When blur, we cannot get the original selection from editor.
            // So we always save a selection whenever editor has focus. Then after blur, we can still use this cached selection.
            const newSelection = this.editor.getDOMSelection();

            if (newSelection?.type == 'range') {
                this.state.selection = newSelection;
            }
        }
    };

    private parseTableSelection(
        tableStart: Node,
        tdStart: Node,
        domHelper: DOMHelper
    ): TableSelectionInfo | null {
        let table: HTMLTableElement | null;
        let parsedTable: ParsedTable | null;
        let firstCo: [number, number] | null;

        if (
            (table = domHelper.findClosestElementAncestor(tableStart, 'table')) &&
            (parsedTable = parseTableCells(table)) &&
            (firstCo = this.findCoordinate(parsedTable, tdStart, domHelper))
        ) {
            return { table, parsedTable, firstCo };
        } else {
            return null;
        }
    }

    private updateTableSelection(lastCo: [number, number]) {
        if (this.tableSelection) {
            const { table, firstCo, parsedTable, lastCo: oldCo } = this.tableSelection;

            if (oldCo || firstCo[0] != lastCo[0] || firstCo[1] != lastCo[1]) {
                this.tableSelection.lastCo = lastCo;

                this.setDOMSelection(
                    {
                        type: 'table',
                        table: table,
                        firstRow: Math.min(firstCo[0], lastCo[0]),
                        firstColumn: Math.min(firstCo[1], lastCo[1]),
                        lastRow: Math.max(firstCo[0], lastCo[0]),
                        lastColumn: Math.max(firstCo[1], lastCo[1]),
                    },
                    { table, firstCo, lastCo, parsedTable }
                );

                return true;
            }
        }

        return false;
    }

    private setDOMSelection(
        selection: DOMSelection | null,
        tableSelection: TableSelectionInfo | null
    ) {
        this.editor?.setDOMSelection(selection);
        this.tableSelection = tableSelection;
    }

    private findCoordinate(
        parsedTable: ParsedTable,
        node: Node,
        domHelper: DOMHelper
    ): [number, number] | null {
        const td = domHelper.findClosestElementAncestor(node, TableCellSelector);
        let result: [number, number] | null = null;

        // Try to do a fast check if both TD are in the given TABLE
        if (td) {
            parsedTable.some((row, rowIndex) => {
                const colIndex = td ? row.indexOf(td as HTMLTableCellElement) : -1;

                return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
            });
        }

        // For nested table scenario, try to find the outer TAble cells
        if (!result) {
            parsedTable.some((row, rowIndex) => {
                const colIndex = row.findIndex(
                    cell => typeof cell == 'object' && cell.contains(node)
                );

                return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
            });
        }

        return result;
    }

    private detachMouseEvent() {
        if (this.mouseDisposer) {
            this.mouseDisposer();
            this.mouseDisposer = null;
        }
    }
}

/**
 * @internal
 * Create a new instance of SelectionPlugin.
 * @param option The editor option
 */
export function createSelectionPlugin(
    options: EditorOptions
): PluginWithState<SelectionPluginState> {
    return new SelectionPlugin(options);
}
