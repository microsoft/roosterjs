import { applyFormat } from '../utils/applyFormat';
import { hasMetadata } from '../../modelApi/metadata/updateMetadata';
import { isBlockEmpty } from '../../modelApi/common/isEmpty';
import { moveChildNodes } from '../../domUtils/moveChildNodes';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import type {
    ContentModelBlockHandler,
    ContentModelTable,
    ModelToDomContext,
    TableSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleTable: ContentModelBlockHandler<ContentModelTable> = (
    doc: Document,
    parent: Node,
    table: ContentModelTable,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    if (isBlockEmpty(table)) {
        // Empty table, do not create TABLE element and just return
        return refNode;
    }
    const previousTableContext = context.tableFormat;
    context.tableFormat = {};

    let tableNode = context.allowCacheElement ? table.cachedElement : undefined;

    if (tableNode) {
        refNode = reuseCachedElement(parent, tableNode, refNode);

        moveChildNodes(tableNode);
    } else {
        tableNode = doc.createElement('table');

        if (context.allowCacheElement) {
            table.cachedElement = tableNode;
        }

        parent.insertBefore(tableNode, refNode);

        applyFormat(tableNode, context.formatAppliers.block, table.format, context);
        applyFormat(tableNode, context.formatAppliers.table, table.format, context);
        applyFormat(tableNode, context.formatAppliers.tableBorder, table.format, context);
        applyFormat(tableNode, context.formatAppliers.dataset, table.dataset, context);

        if (!tableNode.cellPadding) {
            const cellPadding = getSameCellPadding(table);
            if (cellPadding) {
                tableNode.cellPadding = cellPadding;
                context.tableFormat.alreadyWroteCellPadding = true;
            }
        }
    }

    context.onNodeCreated?.(table, tableNode);

    const tbody = doc.createElement('tbody');
    tableNode.appendChild(tbody);

    for (let row = 0; row < table.rows.length; row++) {
        const tableRow = table.rows[row];

        if (tableRow.cells.length == 0) {
            // Skip empty row
            continue;
        }

        const tr = (context.allowCacheElement && tableRow.cachedElement) || doc.createElement('tr');
        tbody.appendChild(tr);
        moveChildNodes(tr);

        if (!tableRow.cachedElement) {
            if (context.allowCacheElement) {
                tableRow.cachedElement = tr;
            }

            applyFormat(tr, context.formatAppliers.tableRow, tableRow.format, context);
        }

        context.onNodeCreated?.(tableRow, tr);

        for (let col = 0; col < tableRow.cells.length; col++) {
            const cell = tableRow.cells[col];

            if (cell.isSelected) {
                const tableSelection: TableSelection = context.tableSelection || {
                    type: 'table',
                    table: tableNode,
                    firstColumn: col,
                    lastColumn: col,
                    firstRow: row,
                    lastRow: row,
                };

                if (tableSelection.table == tableNode) {
                    tableSelection.lastColumn = Math.max(tableSelection.lastColumn, col);
                    tableSelection.lastRow = Math.max(tableSelection.lastRow, row);
                }

                context.tableSelection = tableSelection;
            }

            if (!cell.spanAbove && !cell.spanLeft) {
                const td =
                    (context.allowCacheElement && cell.cachedElement) ||
                    doc.createElement(cell.isHeader ? 'th' : 'td');

                tr.appendChild(td);

                let rowSpan = 1;
                let colSpan = 1;
                let width = table.widths[col];
                let height = tableRow.height;

                for (; table.rows[row + rowSpan]?.cells[col]?.spanAbove; rowSpan++) {
                    height += table.rows[row + rowSpan].height;
                }
                for (; tableRow.cells[col + colSpan]?.spanLeft; colSpan++) {
                    width += table.widths[col + colSpan];
                }

                if (rowSpan > 1) {
                    td.rowSpan = rowSpan;
                }

                if (colSpan > 1) {
                    td.colSpan = colSpan;
                }

                if (!cell.cachedElement || (cell.format.useBorderBox && hasMetadata(table))) {
                    if (width > 0 && !td.style.width) {
                        td.style.width = width + 'px';
                    }

                    if (height > 0 && !td.style.height) {
                        td.style.height = height + 'px';
                    }
                }

                if (!cell.cachedElement) {
                    if (context.allowCacheElement) {
                        cell.cachedElement = td;
                    }

                    applyFormat(td, context.formatAppliers.block, cell.format, context);
                    applyFormat(td, context.formatAppliers.tableCell, cell.format, context);
                    applyFormat(td, context.formatAppliers.tableCellBorder, cell.format, context);
                    applyFormat(td, context.formatAppliers.dataset, cell.dataset, context);
                }

                context.modelHandlers.blockGroupChildren(doc, td, cell, context);

                context.onNodeCreated?.(cell, td);
            }
        }
    }

    context.domIndexer?.onTable(tableNode, table);
    context.tableFormat = previousTableContext;

    return refNode;
};

function getSameCellPadding(table: ContentModelTable) {
    let cellPadding: string | undefined;

    const firstCell = table.rows[0]?.cells[0];
    const { paddingBottom, paddingLeft, paddingRight, paddingTop } = firstCell.format;

    if (
        paddingBottom == paddingLeft &&
        paddingBottom == paddingRight &&
        paddingBottom == paddingTop
    ) {
        cellPadding = paddingBottom;
    }

    if (
        cellPadding &&
        table.rows.every(row =>
            row.cells.every(
                cell =>
                    cell.format.paddingBottom == cellPadding &&
                    cell.format.paddingLeft == cellPadding &&
                    cell.format.paddingRight == cellPadding &&
                    cell.format.paddingTop == cellPadding
            )
        )
    ) {
        return cellPadding.match(/\d+/)?.[0];
    }

    return undefined;
}
