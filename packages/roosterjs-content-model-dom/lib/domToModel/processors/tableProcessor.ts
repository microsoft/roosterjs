import { addBlock } from '../../modelApi/common/addBlock';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';
import { getBoundingClientRect } from '../utils/getBoundingClientRect';
import { getSelectionRootNode } from '../../domUtils/selection/getSelectionRootNode';
import { isElementOfType } from '../../domUtils/isElementOfType';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { parseFormat } from '../utils/parseFormat';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelTableCellFormat,
    DatasetFormat,
    DomToModelContext,
    ElementProcessor,
    SizeFormat,
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
            const tableSelection = context.selection?.type == 'table' ? context.selection : null;
            const selectedTable = tableSelection?.table;
            const hasTableSelection = selectedTable == tableElement;
            const recalculateTableSize = shouldRecalculateTableSize(tableElement, context);

            if (context.allowCacheElement) {
                table.cachedElement = tableElement;
            }

            context.domIndexer?.onTable(tableElement, table);

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

            const columnPositions: (number | undefined)[] = [0];
            const hasColGroup = processColGroup(tableElement, context, columnPositions);
            const rowPositions: number[] = [0];
            const zoomScale = context.zoomScale || 1;
            let maxColumns = 0;

            for (let row = 0; row < tableElement.rows.length; row++) {
                const tr = tableElement.rows[row];
                const tableRow = table.rows[row];

                const tbody = tr.parentNode;

                if (
                    isNodeOfType(tbody, 'ELEMENT_NODE') &&
                    (isElementOfType(tbody, 'tbody') ||
                        isElementOfType(tbody, 'thead') ||
                        isElementOfType(tbody, 'tfoot'))
                ) {
                    parseFormat(tbody, context.formatParsers.tableRow, tableRow.format, context);
                } else if (context.allowCacheElement) {
                    tableRow.cachedElement = tr;
                }

                parseFormat(tr, context.formatParsers.tableRow, tableRow.format, context);

                stackFormat(context, { paragraph: 'shallowClone', segment: 'shallowClone' }, () => {
                    const parent = tr.parentElement;
                    const isInTableSection = parent && getIsInTableSection(parent);

                    if (isInTableSection) {
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

                    tableRow.height = parseInt(tr.style.height) || 0;

                    for (
                        let sourceCol = 0, targetCol = 0;
                        sourceCol < tr.cells.length;
                        sourceCol++
                    ) {
                        for (; tableRow.cells[targetCol]; targetCol++) {}

                        const td = tr.cells[sourceCol];
                        const hasSelectionBeforeCell = context.isInSelection;
                        if (recalculateTableSize) {
                            const colEnd = targetCol + td.colSpan;
                            const rowEnd = row + td.rowSpan;
                            const needCalcWidth = columnPositions[colEnd] === undefined;
                            const needCalcHeight = rowPositions[rowEnd] === undefined;

                            if (needCalcWidth || needCalcHeight) {
                                const rect = getBoundingClientRect(td);

                                if (rect.width > 0 || rect.height > 0) {
                                    if (needCalcWidth) {
                                        const pos = columnPositions[targetCol];

                                        columnPositions[colEnd] =
                                            (typeof pos == 'number' ? pos : 0) +
                                            rect.width / zoomScale;
                                    }

                                    if (needCalcHeight) {
                                        rowPositions[rowEnd] =
                                            rowPositions[row] + rect.height / zoomScale;
                                    }
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
                                    colSpan <= (td.colSpan == 0 ? 1 : td.colSpan);
                                    colSpan++, targetCol++
                                ) {
                                    for (
                                        let rowSpan = 1;
                                        // RowSpan of 0 means it should span to the end of the table
                                        // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#rowspan
                                        rowSpan <=
                                        (td.rowSpan == 0
                                            ? isInTableSection
                                                ? translateRowSpanZero(parent, td)
                                                : 1
                                            : td.rowSpan);
                                        rowSpan++
                                    ) {
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
                                            // When there is COLGROUP, width on table cell should be ignored, so we should not cache the table cell,
                                            // and always recreate it when write back using the table formats
                                            if (context.allowCacheElement && !hasColGroup) {
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
                                                tableSelection &&
                                                row >= tableSelection.firstRow &&
                                                row <= tableSelection.lastRow &&
                                                targetCol >= tableSelection.firstColumn &&
                                                targetCol <= tableSelection.lastColumn)
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

                maxColumns = Math.max(maxColumns, tableRow.cells.length);
            }

            table.widths = calcSizes(columnPositions);

            const heights = calcSizes(rowPositions);

            for (let i = 0; i < table.rows.length; i++) {
                const row = table.rows[i];
                const currentLength = row.cells.length;

                if (currentLength > 0 && currentLength < maxColumns) {
                    const lastCell = row.cells[currentLength - 1];

                    for (let col = currentLength; col < maxColumns; col++) {
                        const spanCell = createTableCell(
                            true, // spanLeft
                            false,
                            lastCell.isHeader,
                            lastCell.format
                        );
                        spanCell.dataset = { ...lastCell.dataset };
                        row.cells[col] = spanCell;
                    }
                }

                if (heights[i] > 0) {
                    row.height = heights[i];
                }
            }
        }
    );
};

function translateRowSpanZero(parent: HTMLTableSectionElement, td: HTMLTableCellElement) {
    const amountOfRows = parent.rows.length;

    let tdIndex = -1;
    for (let i = 0; i < parent.rows.length; i++) {
        const row = parent.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
            if (row.cells[j] === td) {
                tdIndex = i;
                break;
            }
        }
        if (tdIndex !== -1) {
            break;
        }
    }

    return amountOfRows - tdIndex;
}

function calcSizes(positions: (number | undefined)[]): number[] {
    const result: number[] = [];
    let lastPos = 0;

    for (let i = positions.length - 1; i >= 0; i--) {
        const pos = positions[i];

        if (typeof pos == 'number') {
            lastPos = pos;
            break;
        }
    }

    for (let i = positions.length - 2; i >= 0; i--) {
        const pos = positions[i];
        if (pos === undefined) {
            result[i] = 0;
        } else {
            result[i] = lastPos - pos;
            lastPos = pos;
        }
    }

    return result;
}

function processColGroup(
    table: HTMLElement,
    context: DomToModelContext,
    result: (number | undefined)[]
): boolean {
    let lastPos = 0;
    let hasColGroup = false;

    for (let child = table.firstChild; child; child = child.nextSibling) {
        if (isNodeOfType(child, 'ELEMENT_NODE') && child.tagName == 'COLGROUP') {
            hasColGroup = true;

            for (let col = child.firstChild; col; col = col.nextSibling) {
                if (isNodeOfType(col, 'ELEMENT_NODE') && col.tagName == 'COL') {
                    const colFormat: SizeFormat = {};

                    parseFormat(col, context.formatParsers.tableColumn, colFormat, context);

                    for (let i = 0; i < parseInt(col.getAttribute('span') ?? '1'); i++) {
                        if (colFormat.width === undefined) {
                            result.push(undefined);
                        } else {
                            const width = parseValueWithUnit(
                                colFormat.width ?? '',
                                undefined /*element*/,
                                'px'
                            );

                            result.push(width + lastPos);
                            lastPos += width;
                        }
                    }
                }
            }
        }
    }

    return hasColGroup;
}

function shouldRecalculateTableSize(table: HTMLTableElement, context: DomToModelContext): boolean {
    switch (context.recalculateTableSize) {
        case true:
        case 'all':
            return true;

        case 'selected':
            const selectionRoot = getSelectionRootNode(context.selection);

            return (
                !!selectionRoot &&
                (selectionRoot == table ||
                    table.contains(selectionRoot) ||
                    selectionRoot.contains(table))
            );

        default:
            return false;
    }
}

function getIsInTableSection(element: HTMLElement): element is HTMLTableSectionElement {
    return (
        isElementOfType(element, 'tbody') ||
        isElementOfType(element, 'thead') ||
        isElementOfType(element, 'tfoot')
    );
}
