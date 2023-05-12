import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { hasMetadata } from '../../domUtils/metadata/updateMetadata';
import { isBlockEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { reuseCachedElement } from '../utils/reuseCachedElement';

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

    let tableNode = table.cachedElement;

    if (tableNode) {
        refNode = reuseCachedElement(parent, tableNode, refNode);

        moveChildNodes(tableNode);
    } else {
        tableNode = doc.createElement('table');

        table.cachedElement = tableNode;
        parent.insertBefore(tableNode, refNode);

        applyFormat(tableNode, context.formatAppliers.block, table.format, context);
        applyFormat(tableNode, context.formatAppliers.table, table.format, context);
        applyFormat(tableNode, context.formatAppliers.tableBorder, table.format, context);
        applyFormat(tableNode, context.formatAppliers.dataset, table.dataset, context);
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

        const tr = tableRow.cachedElement || doc.createElement('tr');
        tbody.appendChild(tr);
        moveChildNodes(tr);

        if (!tableRow.cachedElement) {
            tableRow.cachedElement = tr;
            applyFormat(tr, context.formatAppliers.tableRow, tableRow.format, context);
        }

        context.onNodeCreated?.(tableRow, tr);

        for (let col = 0; col < tableRow.cells.length; col++) {
            const cell = tableRow.cells[col];

            if (cell.isSelected) {
                context.tableSelection = context.tableSelection || {
                    table: tableNode,
                    firstCell: { x: col, y: row },
                    lastCell: { x: col, y: row },
                };

                if (context.tableSelection.table == tableNode) {
                    const lastCell = context.tableSelection.lastCell;

                    lastCell.x = Math.max(lastCell.x, col);
                    lastCell.y = Math.max(lastCell.y, row);
                }
            }

            if (!cell.spanAbove && !cell.spanLeft) {
                let td = cell.cachedElement || doc.createElement(cell.isHeader ? 'th' : 'td');

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
                    if (width > 0) {
                        td.style.width = width + 'px';
                    }

                    if (height > 0) {
                        td.style.height = height + 'px';
                    }
                }

                if (!cell.cachedElement) {
                    cell.cachedElement = td;
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

    return refNode;
};
