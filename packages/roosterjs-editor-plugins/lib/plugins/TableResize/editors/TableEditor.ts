import createCellResizer from './CellResizer';
import createTableInserter from './TableInserter';
import createTableResizer from './TableResizer';
import TableEditFeature, { disposeTableEditFeature } from './TableEditorFeature';
import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { getComputedStyle, normalizeRect } from 'roosterjs-editor-dom';

const INSERTER_HOVER_OFFSET = 5;

/**
 * @internal
 *
 * A table has 5 hot areas to be resized/edited (take LTR example):
 *   [                ]
 *  +[      1         ]+--------------------+
 *  |[                ]|                    |
 * [ ]               [ ]                    |
 * [ ]               [ ]                    |
 * [2]               [3]                    |
 * [ ]               [ ]                    |
 * [ ][       4       ]|                    |
 *  +------------------+--------------------+
 *  |                  |                    |
 *  |                  |                    |
 *  |                  |                    |
 *  +------------------+--------------------+
 *                                           [5]
 *
 * 1 - Hover area to show insert column button
 * 2 - Hover area to show insert row button
 * 3 - Hover area to show vertical resizing bar
 * 4 - Hover area to show horizontal resizing bar
 * 5 - Hover area to show whole table resize button
 *
 * When set a different current table or change current TD, we need to update these areas
 */
export default class TableEditor {
    // 1, 2 - Insert a column or a row
    private horizontalInserter: TableEditFeature;
    private verticalInserter: TableEditFeature;

    // 3, 4 - Resize a column or a row from a cell
    private horizontalResizer: TableEditFeature;
    private verticalResizer: TableEditFeature;

    // 5 - Resize whole table
    private tableResizer: TableEditFeature;

    private isRTL: boolean;
    private isChanged: boolean;

    constructor(private editor: IEditor, public readonly table: HTMLTableElement) {
        const sizeTransformer = editor.getSizeTransformer();
        this.isRTL = getComputedStyle(table, 'direction') == 'rtl';
        this.tableResizer = createTableResizer(
            table,
            sizeTransformer,
            this.isRTL,
            this.onEditTable
        );
        this.editor.addUndoSnapshot();
    }

    dispose() {
        if (this.isChanged && !this.editor.isDisposed()) {
            this.editor.addUndoSnapshot(null /*callback*/, ChangeSource.Format);
        }

        this.disposeTableResizer();
        this.disposeCellResizers();
        this.disposeTableInserter();
    }

    isTableChanged() {
        return this.isChanged;
    }

    onMouseMove(x: number, y: number) {
        for (let i = 0; i < this.table.rows.length; i++) {
            const tr = this.table.rows[i];
            let j = 0;
            for (; j < tr.cells.length; j++) {
                const td = tr.cells[j];
                const tdRect = normalizeRect(td.getBoundingClientRect());

                if (!tdRect) {
                    continue;
                }

                const lessThanBottom = y <= tdRect.bottom;
                const lessThanRight = this.isRTL ? x >= tdRect.right : x <= tdRect.right;

                if (lessThanRight && lessThanBottom) {
                    if (i == 0 && y <= tdRect.top + INSERTER_HOVER_OFFSET) {
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
                            : x <= tdRect.left + INSERTER_HOVER_OFFSET)
                    ) {
                        this.setInserterTd(
                            y > (tdRect.top + tdRect.bottom) / 2
                                ? td
                                : this.table.rows[i - 1]?.cells[0],
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
            const sizeTransformer = this.editor.getSizeTransformer();
            this.horizontalResizer = createCellResizer(
                td,
                sizeTransformer,
                this.isRTL,
                true /*isHorizontal*/,
                this.onResizeCell
            );
            this.verticalResizer = createCellResizer(
                td,
                sizeTransformer,
                this.isRTL,
                false /*isHorizontal*/,
                this.onResizeCell
            );
        }
    }

    private setInserterTd(td: HTMLTableCellElement, isHorizontal?: boolean) {
        const inserter = isHorizontal ? this.horizontalInserter : this.verticalInserter;
        if (inserter && inserter.node != td) {
            this.disposeTableInserter();
        }

        if (!this.horizontalInserter && !this.verticalInserter && td) {
            const newInserter = createTableInserter(
                this.editor,
                td,
                this.isRTL,
                isHorizontal,
                this.onResizeCell
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

    private onEditTable = () => {
        this.isChanged = true;
    };

    private onResizeCell = () => {
        this.disposeTableResizer();
        this.isChanged = true;
    };
}
