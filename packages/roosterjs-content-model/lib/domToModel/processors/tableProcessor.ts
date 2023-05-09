import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';
import { DatasetFormat } from '../../publicTypes/format/formatParts/DatasetFormat';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getBoundingClientRect } from '../utils/getBoundingClientRect';
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
    stackFormat(
        context,
        { segment: 'shallowCloneForBlock', paragraph: 'shallowCloneForGroup' },
        () => {
            parseFormat(tableElement, context.formatParsers.block, context.blockFormat, context);

            const table = createTable(tableElement.rows.length, context.blockFormat);
            const { table: selectedTable, firstCell, lastCell } = context.tableSelection || {};
            const hasTableSelection = selectedTable == tableElement && !!firstCell && !!lastCell;

            if (context.allowCacheElement) {
                table.cachedElement = tableElement;
            }

            parseFormat(tableElement, context.formatParsers.table, table.format, context);
            parseFormat(tableElement, context.formatParsers.tableBorder, table.format, context);
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
                const tableRow = table.rows[row];

                if (context.allowCacheElement) {
                    tableRow.cachedElement = tr;
                }

                parseFormat(tr, context.formatParsers.tableRow, tableRow.format, context);

                stackFormat(context, { paragraph: 'shallowClone', segment: 'shallowClone' }, () => {
                    const parent = tr.parentElement;
                    const parentTag = parent?.tagName;

                    if (
                        parent &&
                        (parentTag == 'TBODY' || parentTag == 'THEAD' || parentTag == 'TFOOT')
                    ) {
                        // If there is TBODY around TR, retrieve format from TBODY first, in case some format are declared there
                        parseFormat(
                            parent,
                            context.formatParsers.block,
                            context.blockFormat,
                            context
                        );
                        parseFormat(
                            parent,
                            context.formatParsers.segmentOnBlock,
                            context.segmentFormat,
                            context
                        );
                    }

                    parseFormat(tr, context.formatParsers.block, context.blockFormat, context);
                    parseFormat(
                        tr,
                        context.formatParsers.segmentOnBlock,
                        context.segmentFormat,
                        context
                    );

                    for (
                        let sourceCol = 0, targetCol = 0;
                        sourceCol < tr.cells.length;
                        sourceCol++
                    ) {
                        for (; tableRow.cells[targetCol]; targetCol++) {}

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
                                    rowPositions[rowEnd] =
                                        rowPositions[row] + rect.height / zoomScale;
                                }
                            }
                        }

                        stackFormat(
                            context,
                            { paragraph: 'shallowClone', segment: 'shallowClone' },
                            () => {
                                parseFormat(
                                    td,
                                    context.formatParsers.block,
                                    context.blockFormat,
                                    context
                                );
                                parseFormat(
                                    td,
                                    context.formatParsers.segmentOnTableCell,
                                    context.segmentFormat,
                                    context
                                );

                                const cellFormat: ContentModelTableCellFormat = {
                                    ...context.blockFormat,
                                };
                                const dataset: DatasetFormat = {};

                                parseFormat(
                                    td,
                                    context.formatParsers.tableCell,
                                    cellFormat,
                                    context
                                );
                                parseFormat(
                                    td,
                                    context.formatParsers.tableBorder,
                                    cellFormat,
                                    context
                                );
                                parseFormat(td, context.formatParsers.dataset, dataset, context);

                                for (
                                    let colSpan = 1;
                                    colSpan <= td.colSpan;
                                    colSpan++, targetCol++
                                ) {
                                    for (let rowSpan = 1; rowSpan <= td.rowSpan; rowSpan++) {
                                        const hasTd = colSpan == 1 && rowSpan == 1;
                                        const cell = createTableCell(
                                            colSpan > 1,
                                            rowSpan > 1,
                                            td.tagName == 'TH',
                                            cellFormat
                                        );

                                        cell.dataset = { ...dataset };

                                        const spannedRow = table.rows[row + rowSpan - 1];

                                        if (spannedRow) {
                                            spannedRow.cells[targetCol] = cell;
                                        }

                                        if (hasTd) {
                                            if (context.allowCacheElement) {
                                                cell.cachedElement = td;
                                            }

                                            const { listParent, levels } = context.listFormat;

                                            context.listFormat.listParent = undefined;
                                            context.listFormat.levels = [];

                                            try {
                                                context.elementProcessors.child(cell, td, context);
                                            } finally {
                                                context.listFormat.listParent = listParent;
                                                context.listFormat.levels = levels;
                                            }
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
                        );
                    }
                });
            }

            table.widths = calcSizes(columnPositions);

            const heights = calcSizes(rowPositions);

            table.rows.forEach((row, i) => {
                if (heights[i] > 0) {
                    row.height = heights[i];
                }
            });
        }
    );
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
