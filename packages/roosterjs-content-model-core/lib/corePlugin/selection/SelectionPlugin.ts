import { isCharacterValue, isModifierKey } from '../../publicApi/domUtils/eventUtils';
import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { normalizePos } from '../../publicApi/domUtils/normalizePos';
import {
    findCoordinate,
    findTableCellElement,
    parseTableCells,
} from '../../publicApi/domUtils/tableCellUtils';
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
    TableSelectionInfo,
    TableCellCoordinate,
} from 'roosterjs-content-model-types';

const MouseLeftButton = 0;
const MouseMiddleButton = 1;
const MouseRightButton = 2;
const Up = 'ArrowUp';
const Down = 'ArrowDown';
const Left = 'ArrowLeft';
const Right = 'ArrowRight';

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: IEditor | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;
    private isSafari = false;
    private isMac = false;

    constructor(options: EditorOptions) {
        this.state = {
            selection: null,
            tableSelection: null,
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
                this.state.tableSelection = null;
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
            target &&
            rawEvent.button == MouseLeftButton &&
            (tableSelection = this.parseTableSelection(target, target, editor.getDOMHelper()))
        ) {
            this.state.tableSelection = tableSelection;

            if (rawEvent.detail >= 3) {
                const lastCo = findCoordinate(
                    tableSelection.parsedTable,
                    rawEvent.target as Node,
                    editor.getDOMHelper()
                );

                if (lastCo) {
                    // Triple click, select the current cell
                    tableSelection.lastCo = lastCo;
                    this.updateTableSelection(lastCo);
                    rawEvent.preventDefault();
                }
            }

            this.state.mouseDisposer = editor.attachDomEvent({
                mousemove: {
                    beforeDispatch: this.onMouseMove,
                },
            });
        }
    }

    private onMouseMove = (event: Event) => {
        if (this.editor && this.state.tableSelection) {
            const hasTableSelection = !!this.state.tableSelection.lastCo;
            const lastCo = findCoordinate(
                this.state.tableSelection.parsedTable,
                event.target as Node,
                this.editor.getDOMHelper()
            );
            const updated = lastCo && this.updateTableSelection(lastCo);

            if (hasTableSelection || updated) {
                event.preventDefault();
            }
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
        const win = editor.getDocument().defaultView;

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

            case 'range':
                if (key == Up || key == Down || key == Left || key == Right) {
                    const start = selection.range.startContainer;
                    this.state.tableSelection = this.parseTableSelection(
                        start,
                        start,
                        editor.getDOMHelper()
                    );

                    if (this.state.tableSelection) {
                        win?.requestAnimationFrame(() => this.handleSelectionInTable(key));
                    }
                }
                break;

            case 'table':
                if (this.state.tableSelection?.lastCo) {
                    const { shiftKey, key } = rawEvent;

                    if (shiftKey && (key == Left || key == Right)) {
                        const isRtl =
                            win?.getComputedStyle(this.state.tableSelection.table).direction ==
                            'rtl';

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
                            this.setDOMSelection(null /*domSelection*/, this.state.tableSelection);
                            win?.requestAnimationFrame(() => this.handleSelectionInTable(key));
                        }
                    }
                }
                break;
        }
    }

    private handleSelectionInTable(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
        if (!this.editor || !this.state.tableSelection) {
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

            if (!tableSel) {
                return;
            }

            let lastCo = findCoordinate(tableSel?.parsedTable, end, domHelper);
            const { parsedTable, firstCo: oldCo, table } = this.state.tableSelection;

            if (lastCo && tableSel.table == table && lastCo.col != oldCo.col) {
                if (key == Up || key == Down) {
                    const change = key == Up ? -1 : 1;
                    const originalTd = findTableCellElement(parsedTable, oldCo)?.cell;
                    let td: HTMLTableCellElement | null = null;

                    lastCo = { row: oldCo.row + change, col: oldCo.col };

                    while (lastCo.row >= 0 && lastCo.row < parsedTable.length) {
                        td = findTableCellElement(parsedTable, lastCo)?.cell || null;

                        if (td == originalTd) {
                            lastCo.row += change;
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
                } else {
                    this.state.tableSelection = null;
                }
            }

            if (!collapsed && lastCo) {
                this.state.tableSelection = tableSel;
                this.updateTableSelection(lastCo);
            }
        }
    }

    private updateTableSelectionFromKeyboard(rowChange: number, colChange: number) {
        if (this.state.tableSelection?.lastCo && this.editor) {
            const { lastCo, parsedTable } = this.state.tableSelection;
            const row = lastCo.row + rowChange;
            const col = lastCo.col + colChange;

            if (row >= 0 && row < parsedTable.length && col >= 0 && col < parsedTable[row].length) {
                this.updateTableSelection({ row, col });
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
            this.setDOMSelection(this.state.selection, this.state.tableSelection);
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
        let firstCo: TableCellCoordinate | null;

        if (
            (table = domHelper.findClosestElementAncestor(tableStart, 'table')) &&
            (parsedTable = parseTableCells(table)) &&
            (firstCo = findCoordinate(parsedTable, tdStart, domHelper))
        ) {
            return { table, parsedTable, firstCo };
        } else {
            return null;
        }
    }

    private updateTableSelection(lastCo: TableCellCoordinate) {
        if (this.state.tableSelection && this.editor) {
            const { table, firstCo, parsedTable, lastCo: oldCo } = this.state.tableSelection;

            if (oldCo || firstCo.row != lastCo.row || firstCo.col != lastCo.col) {
                this.state.tableSelection.lastCo = lastCo;

                this.setDOMSelection(
                    {
                        type: 'table',
                        table,
                        firstRow: firstCo.row,
                        firstColumn: firstCo.col,
                        lastRow: lastCo.row,
                        lastColumn: lastCo.col,
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
        this.state.tableSelection = tableSelection;
    }

    private detachMouseEvent() {
        if (this.state.mouseDisposer) {
            this.state.mouseDisposer();
            this.state.mouseDisposer = undefined;
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
