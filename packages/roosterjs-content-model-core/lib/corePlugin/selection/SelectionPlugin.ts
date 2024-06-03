import { findCoordinate } from './findCoordinate';
import { findTableCellElement } from '../../coreApi/setDOMSelection/findTableCellElement';
import { isSingleImageInSelection } from './isSingleImageInSelection';
import { normalizePos } from './normalizePos';
import {
    isCharacterValue,
    isElementOfType,
    isModifierKey,
    isNodeOfType,
    parseTableCells,
    toArray,
} from 'roosterjs-content-model-dom';
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
    RangeSelection,
} from 'roosterjs-content-model-types';

const MouseLeftButton = 0;
const MouseMiddleButton = 1;
const MouseRightButton = 2;
const Up = 'ArrowUp';
const Down = 'ArrowDown';
const Left = 'ArrowLeft';
const Right = 'ArrowRight';
const Tab = 'Tab';

/**
 * @internal
 */
export const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';
/**
 * @internal
 */
export const DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR = '#C6C6C6';

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: IEditor | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;
    private isSafari = false;
    private isMac = false;
    private scrollTopCache: number = 0;

    constructor(options: EditorOptions) {
        this.state = {
            selection: null,
            tableSelection: null,
            imageSelectionBorderColor:
                options.imageSelectionBorderColor ?? DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: options.imageSelectionBorderColor
                ? undefined
                : DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor:
                options.tableCellSelectionBackgroundColor ??
                DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: options.tableCellSelectionBackgroundColor
                ? undefined
                : DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        };
    }

    getName() {
        return 'Selection';
    }

    initialize(editor: IEditor) {
        this.editor = editor;

        if (!this.state.imageSelectionBorderColorDark && this.state.imageSelectionBorderColor) {
            this.state.imageSelectionBorderColorDark = editor
                .getColorManager()
                .getDarkColor(this.state.imageSelectionBorderColor, undefined, 'border');
        }

        if (
            !this.state.tableCellSelectionBackgroundColorDark &&
            this.state.tableCellSelectionBackgroundColor
        ) {
            this.state.tableCellSelectionBackgroundColorDark = editor
                .getColorManager()
                .getDarkColor(
                    this.state.tableCellSelectionBackgroundColor,
                    undefined,
                    'background'
                );
        }

        const env = this.editor.getEnvironment();
        const document = this.editor.getDocument();

        this.isSafari = !!env.isSafari;
        this.isMac = !!env.isMac;
        document.addEventListener('selectionchange', this.onSelectionChange);
        if (this.isSafari) {
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
        this.editor?.getDocument().removeEventListener('selectionchange', this.onSelectionChange);

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

            case 'scroll':
                if (!this.editor.hasFocus()) {
                    this.scrollTopCache = event.scrollContainer.scrollTop;
                }
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
            this.selectImageWithRange(image, rawEvent);
            return;
        } else if (selection?.type == 'image' && selection.image !== rawEvent.target) {
            this.selectBeforeOrAfterElement(editor, selection.image);
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
            const currentNode = event.target as Node;
            const domHelper = this.editor.getDOMHelper();

            const range = this.editor.getDocument().createRange();
            const startNode = this.state.tableSelection.startNode;
            const isReverted =
                currentNode.compareDocumentPosition(startNode) == Node.DOCUMENT_POSITION_FOLLOWING;

            if (isReverted) {
                range.setStart(currentNode, 0);
                range.setEnd(
                    startNode,
                    isNodeOfType(startNode, 'TEXT_NODE')
                        ? startNode.nodeValue?.length ?? 0
                        : startNode.childNodes.length
                );
            } else {
                range.setStart(startNode, 0);
                range.setEnd(currentNode, 0);
            }

            // Use common container of the range to search a common table that covers both start and end node
            const tableStart = range.commonAncestorContainer;
            const newTableSelection = this.parseTableSelection(tableStart, startNode, domHelper);

            if (newTableSelection) {
                const lastCo = findCoordinate(
                    newTableSelection.parsedTable,
                    currentNode,
                    domHelper
                );

                if (newTableSelection.table != this.state.tableSelection.table) {
                    // Move mouse into another table (nest table scenario)
                    this.state.tableSelection = newTableSelection;
                    this.state.tableSelection.lastCo = lastCo ?? undefined;
                }

                const updated = lastCo && this.updateTableSelection(lastCo);

                if (hasTableSelection || updated) {
                    event.preventDefault();
                }
            } else if (this.editor.getDOMSelection()?.type == 'table') {
                // Move mouse out of table
                this.setDOMSelection(
                    {
                        type: 'range',
                        range,
                        isReverted,
                    },
                    this.state.tableSelection
                );
            }
        }
    };

    private selectImageWithRange(image: HTMLImageElement, event: Event) {
        const range = image.ownerDocument.createRange();
        range.selectNode(image);

        const domSelection = this.editor?.getDOMSelection();
        if (domSelection?.type == 'image' && image == domSelection.image) {
            event.preventDefault();
        } else {
            this.setDOMSelection(
                {
                    type: 'range',
                    isReverted: false,
                    range,
                },
                null
            );
        }
    }

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
            this.selectImageWithRange(image, event.rawEvent);
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
                        this.selectBeforeOrAfterElement(editor, selection.image);
                        rawEvent.stopPropagation();
                    } else if (key !== 'Delete' && key !== 'Backspace') {
                        this.selectBeforeOrAfterElement(editor, selection.image);
                    }
                }
                break;

            case 'range':
                if (key == Up || key == Down || key == Left || key == Right || key == Tab) {
                    const start = selection.range.startContainer;
                    this.state.tableSelection = this.parseTableSelection(
                        start,
                        start,
                        editor.getDOMHelper()
                    );

                    if (this.state.tableSelection && !rawEvent.defaultPrevented) {
                        if (key == Tab) {
                            this.handleSelectionInTable(this.getTabKey(rawEvent));
                            rawEvent.preventDefault();
                        } else {
                            win?.requestAnimationFrame(() => this.handleSelectionInTable(key));
                        }
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

    private getTabKey(rawEvent: KeyboardEvent) {
        return rawEvent.shiftKey ? 'TabLeft' : 'TabRight';
    }

    private handleSelectionInTable(
        key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'TabLeft' | 'TabRight'
    ) {
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

            if (lastCo && tableSel.table == table) {
                if (lastCo.col != oldCo.col && (key == Up || key == Down)) {
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
                        this.setRangeSelectionInTable(
                            td,
                            key == Up ? td.childNodes.length : 0,
                            this.editor
                        );
                    }
                } else if (key == 'TabLeft' || key == 'TabRight') {
                    const reverse = key == 'TabLeft';
                    for (
                        let step = reverse ? -1 : 1,
                            row = lastCo.row ?? 0,
                            col = (lastCo.col ?? 0) + step;
                        ;
                        col += step
                    ) {
                        if (col < 0 || col >= parsedTable[row].length) {
                            row += step;
                            if (row < 0) {
                                this.selectBeforeOrAfterElement(this.editor, tableSel.table);
                                break;
                            } else if (row >= parsedTable.length) {
                                this.selectBeforeOrAfterElement(
                                    this.editor,
                                    tableSel.table,
                                    true /*after*/
                                );
                                break;
                            }
                            col = reverse ? parsedTable[row].length - 1 : 0;
                        }
                        const cell = parsedTable[row][col];

                        if (typeof cell != 'string') {
                            this.setRangeSelectionInTable(cell, 0, this.editor);
                            lastCo.row = row;
                            lastCo.col = col;
                            break;
                        }
                    }
                } else {
                    this.state.tableSelection = null;
                }

                if (
                    collapsed &&
                    (lastCo.col != oldCo.col || lastCo.row != oldCo.row) &&
                    lastCo.row >= 0 &&
                    lastCo.row == parsedTable.length - 1 &&
                    lastCo.col == parsedTable[lastCo.row]?.length - 1
                ) {
                    this.editor?.announce({ defaultStrings: 'announceOnFocusLastCell' });
                }
            }

            if (!collapsed && lastCo) {
                this.state.tableSelection = tableSel;
                this.updateTableSelection(lastCo);
            }
        }
    }

    private setRangeSelectionInTable(cell: Node, nodeOffset: number, editor: IEditor) {
        // Get deepest editable position in the cell
        const { node, offset } = normalizePos(cell, nodeOffset);

        const range = editor.getDocument().createRange();
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

    private selectBeforeOrAfterElement(editor: IEditor, element: HTMLElement, after?: boolean) {
        const doc = editor.getDocument();
        const parent = element.parentNode;
        const index = parent && toArray(parent.childNodes).indexOf(element);

        if (parent && index !== null && index >= 0) {
            const range = doc.createRange();
            range.setStart(parent, index + (after ? 1 : 0));
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

        if (this.scrollTopCache && this.editor) {
            const sc = this.editor.getScrollContainer();
            sc.scrollTop = this.scrollTopCache;
            this.scrollTopCache = 0;
        }
    };

    private onBlur = () => {
        if (this.editor) {
            if (!this.state.selection) {
                this.state.selection = this.editor.getDOMSelection();
            }
            const sc = this.editor.getScrollContainer();
            this.scrollTopCache = sc.scrollTop;
        }
    };

    private onSelectionChange = () => {
        if (this.editor?.hasFocus() && !this.editor.isInShadowEdit()) {
            const newSelection = this.editor.getDOMSelection();

            //If am image selection changed to a wider range due a keyboard event, we should update the selection
            const selection = this.editor.getDocument().getSelection();

            if (newSelection?.type == 'image' && selection) {
                if (selection && !isSingleImageInSelection(selection)) {
                    const range = selection.getRangeAt(0);
                    this.editor.setDOMSelection({
                        type: 'range',
                        range,
                        isReverted:
                            selection.focusNode != range.endContainer ||
                            selection.focusOffset != range.endOffset,
                    });
                }
            }

            // Safari has problem to handle onBlur event. When blur, we cannot get the original selection from editor.
            // So we always save a selection whenever editor has focus. Then after blur, we can still use this cached selection.
            if (newSelection?.type == 'range') {
                if (this.isSafari) {
                    this.state.selection = newSelection;
                }
                this.trySelectSingleImage(newSelection);
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
            table.isContentEditable &&
            (parsedTable = parseTableCells(table)) &&
            (firstCo = findCoordinate(parsedTable, tdStart, domHelper))
        ) {
            return { table, parsedTable, firstCo, startNode: tdStart };
        } else {
            return null;
        }
    }

    private updateTableSelection(lastCo: TableCellCoordinate) {
        if (this.state.tableSelection && this.editor) {
            const {
                table,
                firstCo,
                parsedTable,
                startNode,
                lastCo: oldCo,
            } = this.state.tableSelection;

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
                    { table, firstCo, lastCo, parsedTable, startNode }
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

    private trySelectSingleImage(selection: RangeSelection) {
        if (!selection.range.collapsed) {
            const image = isSingleImageInSelection(selection.range);
            if (image) {
                this.setDOMSelection(
                    {
                        type: 'image',
                        image: image,
                    },
                    null /*tableSelection*/
                );
            }
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
