import { addBlock } from '../../modelApi/common/addBlock';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';
import { getBoundingClientRect } from '../utils/getBoundingClientRect';
import { parseFormat } from '../utils/parseFormat';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import { stackFormat } from '../utils/stackFormat';
import {
    ContentModelTableCellFormat,
    DatasetFormat,
    ElementProcessor,
} from 'roosterjs-content-model-types';

/**
 * Content Model Element Processor for table
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
 * @param group The parent block group
 * @param parent Parent DOM node to process
 * @param context DOM to Content Model context
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
            const tableSelection =
                context.rangeEx?.type == SelectionRangeTypes.TableSelection
                    ? context.rangeEx
                    : null;
            const selectedTable = tableSelection?.table;
            const coordinates = tableSelection?.coordinates;
            const hasTableSelection =
                selectedTable == tableElement &&
                !!coordinates?.firstCell &&
                !!coordinates?.lastCell;

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
            const zoomScale = context.zoomScale || 1;

            for (let row = 0; row < tableElement.rows.length; row++) {
                const tr = tableElement.rows[row];
                const tableRow = table.rows[row];

                const tbody = tr.parentNode;

                if (safeInstanceOf(tbody, 'HTMLTableSectionElement')) {
                    parseFormat(tbody, context.formatParsers.tableRow, tableRow.format, context);
                } else if (context.allowCacheElement) {
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
                                                row >= coordinates.firstCell.y &&
                                                row <= coordinates.lastCell.y &&
                                                targetCol >= coordinates.firstCell.x &&
                                                targetCol <= coordinates.lastCell.x)
                                        ) {
                                            cell.isSelected = true;
                                        }
                                    }
                                }
                            }
                        );
                    }
                });

                for (let col = 0; col < tableRow.cells.length; col++) {
                    if (!tableRow.cells[col]) {
                        tableRow.cells[col] = createTableCell(
                            false,
                            false,
                            false,
                            context.blockFormat
                        );
                    }
                }
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
