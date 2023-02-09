import { addBlock } from '../../modelApi/common/addBlock';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getBoundingClientRect } from '../utils/getBoundingClientRect';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 *
 * For Table with merged/splitted cells, HTML uses colSpan and rowSpan attributes to specify how it should be rendered.
 * To make it easier to edit a table, we will use a different way to describe table.
 *
 * 1. For a m * n table (m rows, n columns), we always create a m * n array for the cells.
 * 2. For a regular table cell, it is mapped to one item of this array
 * 3. For a merged/splitted table cell, it will has colSpan/rowSpan value. We also created TableCell model for those spanned
 * cells, and use "spanLeft" and "spanAbove" to mark its state
 * 4. When edit table, we always edit on this mapped m * n array because it always has an item for each cell
 * 5. When write back to DOM, we create TD/TH elements for those non-spanned cells, and mark its colSpan/rowSpan value according
 * its neighbour cell's spanLeft/spanAbove attribute
 */
export const tableProcessor: ElementProcessor<HTMLTableElement> = (
    group,
    tableElement,
    context
) => {
    const table = createTable(tableElement.rows.length);
    const { table: selectedTable, firstCell, lastCell } = context.tableSelection || {};
    const hasTableSelection = selectedTable == tableElement && !!firstCell && !!lastCell;

    stackFormat(context, { segment: 'shallowCloneForBlock', paragraph: 'empty' }, () => {
        parseFormat(tableElement, context.formatParsers.table, table.format, context);
        parseFormat(
            tableElement,
            context.formatParsers.segmentOnBlock,
            context.segmentFormat,
            context
        );
        parseFormat(tableElement, context.formatParsers.dataset, table.dataset, context);
        addBlock(group, table);

        const columnPositions: number[] = [0];
        const rowPositions: number[] = [0];
        const zoomScale = context.zoomScaleFormat.zoomScale || 1;

        for (let row = 0; row < tableElement.rows.length; row++) {
            const tr = tableElement.rows[row];
            for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
                for (; table.cells[row][targetCol]; targetCol++) {}

                const td = tr.cells[sourceCol];
                const hasSelectionBeforeCell = context.isInSelection;
                const colEnd = targetCol + td.colSpan;
                const rowEnd = row + td.rowSpan;
                const needCalcWidth = columnPositions[colEnd] === undefined;
                const needCalcHeight = rowPositions[rowEnd] === undefined;

                if (needCalcWidth || needCalcHeight) {
                    const rect = getBoundingClientRect(td);

                    if (rect.width > 0 || rect.height > 0) {
                        if (needCalcWidth) {
                            columnPositions[colEnd] =
                                columnPositions[targetCol] + rect.width / zoomScale;
                        }

                        if (needCalcHeight) {
                            rowPositions[rowEnd] = rowPositions[row] + rect.height / zoomScale;
                        }
                    }
                }

                for (let colSpan = 1; colSpan <= td.colSpan; colSpan++, targetCol++) {
                    for (let rowSpan = 1; rowSpan <= td.rowSpan; rowSpan++) {
                        const hasTd = colSpan == 1 && rowSpan == 1;
                        const cell = createTableCell(colSpan > 1, rowSpan > 1, td.tagName == 'TH');

                        table.cells[row + rowSpan - 1][targetCol] = cell;

                        if (hasTd) {
                            stackFormat(context, { segment: 'shallowClone' }, () => {
                                parseFormat(
                                    td,
                                    context.formatParsers.tableCell,
                                    cell.format,
                                    context
                                );
                                parseFormat(
                                    td,
                                    context.formatParsers.segmentOnTableCell,
                                    context.segmentFormat,
                                    context
                                );
                                parseFormat(
                                    td,
                                    context.formatParsers.dataset,
                                    cell.dataset,
                                    context
                                );

                                const { listParent, levels } = context.listFormat;

                                context.listFormat.listParent = undefined;
                                context.listFormat.levels = [];

                                try {
                                    context.elementProcessors.child(cell, td, context);
                                } finally {
                                    context.listFormat.listParent = listParent;
                                    context.listFormat.levels = levels;
                                }
                            });
                        }

                        const hasSelectionAfterCell = context.isInSelection;

                        if (
                            (hasSelectionBeforeCell && hasSelectionAfterCell) ||
                            (hasTableSelection &&
                                row >= firstCell.y &&
                                row <= lastCell.y &&
                                targetCol >= firstCell.x &&
                                targetCol <= lastCell.x)
                        ) {
                            cell.isSelected = true;
                        }
                    }
                }
            }
        }

        table.widths = calcSizes(columnPositions);
        table.heights = calcSizes(rowPositions);

        if (context.alwaysNormalizeTable) {
            normalizeTable(table);
        }
    });
};

function calcSizes(positions: number[]): number[] {
    let result: number[] = [];
    let lastPos = positions[positions.length - 1];

    for (let i = positions.length - 2; i >= 0; i--) {
        if (positions[i] === undefined) {
            result[i] = 0;
        } else {
            result[i] = lastPos - positions[i];
            lastPos = positions[i];
        }
    }

    return result;
}
