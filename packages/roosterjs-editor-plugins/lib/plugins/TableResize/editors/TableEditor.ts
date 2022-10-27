import createCellResizer from './CellResizer';
import createTableInserter from './TableInserter';
import createTableResizer from './TableResizer';
import createTableSelector from './TableSelector';
import TableEditFeature, { disposeTableEditFeature } from './TableEditorFeature';
import { getComputedStyle, normalizeRect, Position, VTable } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    IEditor,
    NodePosition,
    TableSelection,
    CreateElementData,
} from 'roosterjs-editor-types';

const INSERTER_HOVER_OFFSET = 5;

/**
 * @internal
 *
 * A table has 5 hot areas to be resized/edited (take LTR example):
 *
 *   [6]  [                ]
 *       +[      1         ]+--------------------+
 *       |[                ]|                    |
 *      [ ]               [ ]                    |
 *      [ ]               [ ]                    |
 *      [2]               [3]                    |
 *      [ ]               [ ]                    |
 *      [ ][       4       ]|                    |
 *       +------------------+--------------------+
 *       |                  |                    |
 *       |                  |                    |
 *       |                  |                    |
 *       +------------------+--------------------+
 *                                                [5]
 *
 * 1 - Hover area to show insert column button
 * 2 - Hover area to show insert row button
 * 3 - Hover area to show vertical resizing bar
 * 4 - Hover area to show horizontal resizing bar
 * 5 - Hover area to show whole table resize button
 * 6 - Hover area to show whole table selector button
 *
 * When set a different current table or change current TD, we need to update these areas
 */
export default class TableEditor {
    // 1, 2 - Insert a column or a row
    private horizontalInserter: TableEditFeature | null = null;
    private verticalInserter: TableEditFeature | null = null;

    // 3, 4 - Resize a column or a row from a cell
    private horizontalResizer: TableEditFeature | null = null;
    private verticalResizer: TableEditFeature | null = null;

    // 5 - Resize whole table
    private tableResizer: TableEditFeature | null;

    // 6 - Select whole table
    private tableSelector: TableEditFeature | null;

    private isRTL: boolean;
    private start: NodePosition;
    private end: NodePosition;
    private isCurrentlyEditing: boolean;

    constructor(
        private editor: IEditor,
        public readonly table: HTMLTableElement,
        private onChanged: () => void,
        private onShowHelperElement?: (
            elementData: CreateElementData,
            helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
        ) => void,
        contentDiv?: EventTarget
    ) {
        this.isRTL = getComputedStyle(table, 'direction') == 'rtl';
        const zoomScale = editor.getZoomScale();
        this.tableResizer = createTableResizer(
            table,
            zoomScale,
            this.isRTL,
            this.onStartTableResize,
            this.onFinishEditing,
            this.onShowHelperElement
        );
        this.tableSelector = createTableSelector(
            table,
            zoomScale,
            editor,
            this.onSelect,
            this.onShowHelperElement,
            contentDiv
        );
        this.isCurrentlyEditing = false;
    }

    dispose() {
        this.disposeTableResizer();
        this.disposeCellResizers();
        this.disposeTableInserter();
        this.disposeTableSelector();
    }

    isEditing(): boolean {
        return this.isCurrentlyEditing;
    }

    onMouseMove(x: number, y: number) {
        for (let i = 0; i < this.table.rows.length; i++) {
            const tr = this.table.rows[i];
            let j = 0;
            for (; j < tr.cells.length; j++) {
                const td = tr.cells[j];
                const tableRect = normalizeRect(this.table.getBoundingClientRect());
                const tdRect = normalizeRect(td.getBoundingClientRect());

                if (!tdRect || !tableRect) {
                    continue;
                }

                const lessThanBottom = y <= tdRect.bottom;
                const lessThanRight = this.isRTL ? x >= tdRect.right : x <= tdRect.right;

                if (lessThanRight && lessThanBottom) {
                    const isOnLeftOrRight = this.isRTL
                        ? tdRect.right <= tableRect.right && tdRect.right >= tableRect.right - 1
                        : tdRect.left >= tableRect.left && tdRect.left <= tableRect.left + 1;
                    if (i === 0 && y <= tdRect.top + INSERTER_HOVER_OFFSET) {
                        const center = (tdRect.left + tdRect.right) / 2;
                        const isOnRightHalf = this.isRTL ? x < center : x > center;
                        this.setInserterTd(
                            isOnRightHalf ? td : tr.cells[j - 1],
                            false /*isHorizontal*/
                        );
                    } else if (
                        j == 0 &&
                        (this.isRTL
                            ? x >= tdRect.right - INSERTER_HOVER_OFFSET
                            : x <= tdRect.left + INSERTER_HOVER_OFFSET) &&
                        isOnLeftOrRight
                    ) {
                        const tdAbove = this.table.rows[i - 1]?.cells[0];
                        const tdAboveRect = tdAbove
                            ? normalizeRect(tdAbove.getBoundingClientRect())
                            : null;

                        const isTdNotAboveMerged = !tdAboveRect
                            ? null
                            : this.isRTL
                            ? tdAboveRect.right === tdRect.right
                            : tdAboveRect.left === tdRect.left;

                        this.setInserterTd(
                            y < (tdRect.top + tdRect.bottom) / 2 && isTdNotAboveMerged
                                ? tdAbove
                                : td,
                            true /*isHorizontal*/
                        );
                    } else {
                        this.setInserterTd(null);
                    }

                    this.setResizingTd(td);

                    break;
                }
            }

            if (j < tr.cells.length) {
                break;
            }
        }
    }

    private setResizingTd(td: HTMLTableCellElement) {
        if (this.horizontalResizer && this.horizontalResizer.node != td) {
            this.disposeCellResizers();
        }

        if (!this.horizontalResizer && td) {
            const zoomScale = this.editor.getZoomScale();
            this.horizontalResizer = createCellResizer(
                td,
                zoomScale,
                this.isRTL,
                true /*isHorizontal*/,
                this.onStartCellResize,
                this.onFinishEditing,
                this.onShowHelperElement
            );
            this.verticalResizer = createCellResizer(
                td,
                zoomScale,
                this.isRTL,
                false /*isHorizontal*/,
                this.onStartCellResize,
                this.onFinishEditing,
                this.onShowHelperElement
            );
        }
    }

    /**
     * create or remove TableInserter
     * @param td td to attach to, set this to null to remove inserters (both horizontal and vertical)
     */
    private setInserterTd(td: HTMLTableCellElement, isHorizontal?: boolean) {
        const inserter = isHorizontal ? this.horizontalInserter : this.verticalInserter;
        if (td === null || (inserter && inserter.node != td)) {
            this.disposeTableInserter();
        }

        if (!this.horizontalInserter && !this.verticalInserter && td) {
            const newInserter = createTableInserter(
                this.editor,
                td,
                this.isRTL,
                !!isHorizontal,
                this.onInserted,
                this.onShowHelperElement
            );
            if (isHorizontal) {
                this.horizontalInserter = newInserter;
            } else {
                this.verticalInserter = newInserter;
            }
        }
    }

    private disposeTableResizer() {
        if (this.tableResizer) {
            disposeTableEditFeature(this.tableResizer);
            this.tableResizer = null;
        }
    }

    private disposeTableInserter() {
        if (this.horizontalInserter) {
            disposeTableEditFeature(this.horizontalInserter);
            this.horizontalInserter = null;
        }
        if (this.verticalInserter) {
            disposeTableEditFeature(this.verticalInserter);
            this.verticalInserter = null;
        }
    }

    private disposeCellResizers() {
        if (this.horizontalResizer) {
            disposeTableEditFeature(this.horizontalResizer);
            this.horizontalResizer = null;
        }
        if (this.verticalResizer) {
            disposeTableEditFeature(this.verticalResizer);
            this.verticalResizer = null;
        }
    }

    private disposeTableSelector() {
        if (this.tableSelector) {
            disposeTableEditFeature(this.tableSelector);
            this.tableSelector = null;
        }
    }

    private onFinishEditing = (): false => {
        this.editor.focus();
        this.editor.select(this.start, this.end);
        this.editor.addUndoSnapshot(null /*callback*/, ChangeSource.Format);
        this.onChanged();
        this.isCurrentlyEditing = false;

        return false;
    };

    private onStartTableResize = () => {
        this.isCurrentlyEditing = true;
        this.onStartResize();
    };

    private onStartCellResize = () => {
        this.isCurrentlyEditing = true;
        this.disposeTableResizer();
        this.onStartResize();
    };

    private onStartResize() {
        this.isCurrentlyEditing = true;
        const range = this.editor.getSelectionRange();

        if (range) {
            this.start = Position.getStart(range);
            this.end = Position.getEnd(range);
        }

        this.editor.addUndoSnapshot();
    }

    private onInserted = (table: HTMLTableElement) => {
        this.editor.transformToDarkColor(table);
        this.disposeTableResizer();
        this.onFinishEditing();
    };

    /**
     * Public only for testing purposes
     * @param table the table to select
     */
    public onSelect = (table: HTMLTableElement) => {
        this.editor.focus();
        if (table) {
            const vTable = new VTable(table);
            if (vTable.cells) {
                const rows = vTable.cells.length - 1;
                let lastCellIndex: number = 0;
                vTable.cells[rows].forEach((cell, index) => {
                    lastCellIndex = index;
                });

                const selection: TableSelection = {
                    firstCell: {
                        x: 0,
                        y: 0,
                    },
                    lastCell: {
                        y: rows,
                        x: lastCellIndex,
                    },
                };
                this.editor.select(table, selection);
            }
        }
    };
}
