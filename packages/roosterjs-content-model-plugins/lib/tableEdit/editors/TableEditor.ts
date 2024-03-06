import { createCellResizer } from './features/CellResizer';
import { createTableInserter } from './features/TableInserter';
import { createTableMover } from './features/TableMover';
import { createTableResizer } from './features/TableResizer';
import { disposeTableEditFeature } from './features/TableEditFeature';
import { isNodeOfType, normalizeRect } from 'roosterjs-content-model-dom';
import type { TableEditFeature } from './features/TableEditFeature';
import type { IEditor, TableSelection } from 'roosterjs-content-model-types';

const INSERTER_HOVER_OFFSET = 6;
const enum TOP_OR_SIDE {
    top = 0,
    side = 1,
}
/**
 * @internal
 *
 * A table has 6 hot areas to be resized/edited (take LTR example):
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
 * 5 - Hover area to show whole table resize handle
 * 6 - Hover area to show whole table mover handle
 *
 * When set a different current table or change current TD, we need to update these areas
 */
export class TableEditor {
    // 1, 2 - Insert a column or a row
    private horizontalInserter: TableEditFeature | null = null;
    private verticalInserter: TableEditFeature | null = null;

    // 3, 4 - Resize a column or a row from a cell
    private horizontalResizer: TableEditFeature | null = null;
    private verticalResizer: TableEditFeature | null = null;

    // 5 - Resize whole table
    private tableResizer: TableEditFeature | null = null;

    // 6 - Move as well as select whole table
    private tableMover: TableEditFeature | null = null;

    private isRTL: boolean;
    private range: Range | null = null;
    private isCurrentlyEditing: boolean;

    constructor(
        private editor: IEditor,
        public readonly table: HTMLTableElement,
        private onChanged: () => void,
        private anchorContainer?: HTMLElement,
        private contentDiv?: EventTarget | null
    ) {
        this.isRTL = editor.getDocument().defaultView?.getComputedStyle(table).direction == 'rtl';
        this.setEditorFeatures();
        this.isCurrentlyEditing = false;
    }

    dispose() {
        this.disposeTableResizer();
        this.disposeCellResizers();
        this.disposeTableInserter();
        this.disposeTableMover();
    }

    isEditing(): boolean {
        return this.isCurrentlyEditing;
    }

    isOwnedElement(node: Node) {
        return [
            this.tableResizer,
            this.tableMover,
            this.horizontalInserter,
            this.verticalInserter,
            this.horizontalResizer,
            this.verticalResizer,
        ]
            .filter(feature => !!feature?.div)
            .some(feature => feature?.div == node);
    }

    onMouseMove(x: number, y: number) {
        // Get whole table rect
        const tableRect = normalizeRect(this.table.getBoundingClientRect());

        //console.log('>>>tableRect', tableRect);
        if (!tableRect) {
            return;
        }

        // Determine if cursor is on top or side
        const topOrSide =
            y <= tableRect.top + INSERTER_HOVER_OFFSET
                ? TOP_OR_SIDE.top
                : this.isRTL
                ? x >= tableRect.right - INSERTER_HOVER_OFFSET
                    ? TOP_OR_SIDE.side
                    : undefined
                : x <= tableRect.left + INSERTER_HOVER_OFFSET
                ? TOP_OR_SIDE.side
                : undefined;
        const topOrSideBinary = topOrSide ? 1 : 0;

        // i is row index, j is column index
        for (let i = 0; i < this.table.rows.length; i++) {
            const tr = this.table.rows[i];
            let j = 0;
            for (; j < tr.cells.length; j++) {
                const td = tr.cells[j];
                const tdRect = normalizeRect(td.getBoundingClientRect());

                if (!tdRect || !tableRect) {
                    continue;
                }

                // Determine the cell the cursor is in range of
                // Offset is only used for first row and column
                const lessThanBottom = y <= tdRect.bottom;
                const lessThanRight = this.isRTL
                    ? x <= tdRect.right + INSERTER_HOVER_OFFSET * topOrSideBinary
                    : x <= tdRect.right;
                const moreThanLeft = this.isRTL
                    ? x >= tdRect.left
                    : x >= tdRect.left - INSERTER_HOVER_OFFSET * topOrSideBinary;

                if (lessThanBottom && lessThanRight && moreThanLeft) {
                    if (i === 0 && topOrSide == TOP_OR_SIDE.top) {
                        const center = (tdRect.left + tdRect.right) / 2;
                        const isOnRightHalf = this.isRTL ? x < center : x > center;
                        this.setInserterTd(
                            isOnRightHalf ? td : tr.cells[j - 1],
                            false /*isHorizontal*/
                        );
                    } else if (j === 0 && topOrSide == TOP_OR_SIDE.side) {
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

                    //Cell found
                    break;
                }
            }

            if (j < tr.cells.length) {
                break;
            }
        }

        // Create Mover and Resizer
        this.setEditorFeatures();
    }

    private setEditorFeatures() {
        if (!this.tableMover) {
            this.tableMover = createTableMover(
                this.table,
                this.editor,
                this.isRTL,
                this.onSelect,
                this.getOnMouseOut,
                this.contentDiv,
                this.anchorContainer
            );
        }

        if (!this.tableResizer) {
            this.tableResizer = createTableResizer(
                this.table,
                this.editor,
                this.isRTL,
                this.onStartTableResize,
                this.onFinishEditing,
                this.contentDiv,
                this.anchorContainer
            );
        }
    }

    private setResizingTd(td: HTMLTableCellElement) {
        if (this.horizontalResizer && this.horizontalResizer.node != td) {
            this.disposeCellResizers();
        }

        if (!this.horizontalResizer && td) {
            this.horizontalResizer = createCellResizer(
                this.editor,
                td,
                this.table,
                this.isRTL,
                true /*isHorizontal*/,
                this.onStartCellResize,
                this.onFinishEditing,
                this.anchorContainer
            );
            this.verticalResizer = createCellResizer(
                this.editor,
                td,
                this.table,
                this.isRTL,
                false /*isHorizontal*/,
                this.onStartCellResize,
                this.onFinishEditing,
                this.anchorContainer
            );
        }
    }

    /**
     * create or remove TableInserter
     * @param td td to attach to, set this to null to remove inserters (both horizontal and vertical)
     */
    private setInserterTd(td: HTMLTableCellElement | null, isHorizontal?: boolean) {
        const inserter = isHorizontal ? this.horizontalInserter : this.verticalInserter;
        if (td === null || (inserter && inserter.node != td)) {
            this.disposeTableInserter();
        }

        if (!this.horizontalInserter && !this.verticalInserter && td) {
            const newInserter = createTableInserter(
                this.editor,
                td,
                this.table,
                this.isRTL,
                !!isHorizontal,
                this.onInserted,
                this.getOnMouseOut,
                this.anchorContainer
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

    private disposeTableMover() {
        if (this.tableMover) {
            disposeTableEditFeature(this.tableMover);
            this.tableMover = null;
        }
    }

    private onFinishEditing = (): false => {
        this.editor.focus();

        if (this.range) {
            this.editor.setDOMSelection({ type: 'range', range: this.range, isReverted: false });
        }

        this.editor.takeSnapshot(); // Pass in an empty callback to make sure ContentChangedEvent is triggered
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
        const range = this.editor.getDOMSelection();

        if (range && range.type == 'range') {
            this.range = range.range;
        }

        this.editor.takeSnapshot();
    }

    private onInserted = () => {
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
            const selection: TableSelection = {
                table: table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: table.rows.length - 1,
                lastColumn: table.rows[table.rows.length - 1].cells.length - 1,
                type: 'table',
            };

            this.editor.setDOMSelection(selection);
        }
    };

    private getOnMouseOut = (feature: HTMLElement) => {
        return (ev: MouseEvent) => {
            if (
                feature &&
                ev.relatedTarget != feature &&
                isNodeOfType(this.contentDiv as Node, 'ELEMENT_NODE') &&
                isNodeOfType(ev.relatedTarget as Node, 'ELEMENT_NODE') &&
                !(this.contentDiv == ev.relatedTarget)
            ) {
                this.dispose();
            }
        };
    };
}
