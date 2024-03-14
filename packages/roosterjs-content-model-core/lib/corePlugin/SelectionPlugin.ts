import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { isModifierKey } from '../publicApi/domUtils/eventUtils';
import { parseTableCells } from '../publicApi/domUtils/tableCellUtils';
import type {
    DOMSelection,
    IEditor,
    PluginEvent,
    PluginWithState,
    SelectionPluginState,
    EditorOptions,
    DOMHelper,
    MouseUpEvent,
} from 'roosterjs-content-model-types';

const MouseLeftButton = 0;
const MouseMiddleButton = 1;
const MouseRightButton = 2;
const TableCellSelector = 'TH,TD';

interface TableSelectionInfo {
    table: HTMLTableElement;
    vTable: (HTMLTableCellElement | null)[][];
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

        document.addEventListener('selectionchange', this.onSelectionChange);

        this.disposer = this.editor.attachDomEvent({
            focus: { beforeDispatch: this.onFocus },
            blur: { beforeDispatch: this.isSafari ? undefined : this.onBlur },
        });
    }

    dispose() {
        this.editor?.getDocument().removeEventListener('selectionchange', this.onSelectionChange);

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        if (this.mouseDisposer) {
            this.mouseDisposer();
            this.mouseDisposer = null;
        }

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

        if (selection?.type == 'table' && rawEvent.button == MouseLeftButton) {
            this.setDOMSelection(null /*domSelection*/, null /*tableSelection*/);
        }

        let table: HTMLTableElement | null;
        let vTable: (HTMLTableCellElement | null)[][] | null;
        let firstCo: [number, number] | null;
        const target = rawEvent.target as Node;

        if (
            rawEvent.button == MouseLeftButton &&
            (table = editor.getDOMHelper().findClosestElementAncestor(target, 'table')) &&
            (vTable = parseTableCells(table)) &&
            (firstCo = this.findCoordinate(vTable, target, editor.getDOMHelper()))
        ) {
            this.tableSelection = {
                firstCo,
                table,
                vTable,
            };
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
                this.tableSelection.vTable,
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

        if (this.mouseDisposer) {
            this.mouseDisposer();
            this.mouseDisposer = null;
        }
    }

    private onKeyDown(editor: IEditor, rawEvent: KeyboardEvent) {
        const key = rawEvent.key;
        const selection = editor.getDOMSelection();

        if (
            !isModifierKey(rawEvent) &&
            !rawEvent.shiftKey &&
            selection?.type == 'image' &&
            selection.image.parentNode
        ) {
            if (key === 'Escape') {
                this.selectBeforeImage(editor, selection.image);
                rawEvent.stopPropagation();
            } else if (key !== 'Delete' && key !== 'Backspace') {
                this.selectBeforeImage(editor, selection.image);
            }
        } else if (this.tableSelection?.lastCo && rawEvent.shiftKey && rawEvent.key != 'Shift') {
            const { table, lastCo, vTable } = this.tableSelection;
            const win = editor.getDocument().defaultView;
            const isRtl = win?.getComputedStyle(table).direction == 'rtl';
            const row = lastCo[0] + (key == 'ArrowUp' ? -1 : key == 'ArrowDown' ? 1 : 0);
            const col =
                lastCo[1] +
                (key == 'ArrowLeft' ? -1 : key == 'ArrowRight' ? 1 : 0) * (isRtl ? -1 : 1);

            if (row != lastCo[0] || col != lastCo[1]) {
                rawEvent.preventDefault();

                if (row >= 0 && row < vTable.length && col >= 0 && col < vTable[row].length) {
                    this.updateTableSelection([row, col]);
                }
            } else {
                this.setDOMSelection(null, null);
            }
        } else {
            //this.tableSelection = null;
            //this.setDOMSelection(null, null);
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

    private onSelectionChange = () => {
        if (this.editor?.hasFocus() && !this.editor.isInShadowEdit()) {
            const newSelection = this.editor.getDOMSelection();

            if (newSelection?.type == 'range') {
                if (this.isSafari) {
                    // Safari has problem to handle onBlur event. When blur, we cannot get the original selection from editor.
                    // So we always save a selection whenever editor has focus. Then after blur, we can still use this cached selection.
                    this.state.selection = newSelection;
                }

                if (!this.tableSelection?.lastCo) {
                    const {
                        range: { collapsed, startContainer, endContainer, commonAncestorContainer },
                        isReverted,
                    } = newSelection;

                    const domHelper = this.editor.getDOMHelper();
                    let table: HTMLTableElement | null;
                    let vTable: (HTMLTableCellElement | null)[][] | null;
                    let firstCo: [number, number] | null;
                    let lastCo: [number, number] | null;

                    if (
                        !collapsed &&
                        (table = domHelper.findClosestElementAncestor(
                            commonAncestorContainer,
                            'table'
                        )) &&
                        (vTable = parseTableCells(table)) &&
                        (firstCo = this.findCoordinate(
                            vTable,
                            isReverted ? endContainer : startContainer,
                            domHelper
                        )) &&
                        (lastCo = this.findCoordinate(
                            vTable,
                            isReverted ? startContainer : endContainer,
                            domHelper
                        ))
                    ) {
                        this.tableSelection = { table, vTable, firstCo };
                        this.updateTableSelection(lastCo);
                    }
                }
            }
        }
    };

    private updateTableSelection(lastCo: [number, number]) {
        if (this.tableSelection) {
            const { table, firstCo, vTable, lastCo: oldCo } = this.tableSelection;

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
                    { table, firstCo, lastCo, vTable }
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
        vTable: (HTMLTableCellElement | null)[][],
        node: Node,
        domHelper: DOMHelper
    ): [number, number] | null {
        const td = domHelper.findClosestElementAncestor(node, TableCellSelector);
        let result: [number, number] | null = null;

        // Try to do a fast check if both TD are in the given TABLE
        if (td) {
            vTable.some((row, rowIndex) => {
                const colIndex = td ? row.indexOf(td as HTMLTableCellElement) : -1;

                return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
            });
        }

        // For nested table scenario, try to find the outer TAble cells
        if (!result) {
            vTable.some((row, rowIndex) => {
                const colIndex = row.findIndex(cell => cell?.contains(node));

                return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
            });
        }

        return result;
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
