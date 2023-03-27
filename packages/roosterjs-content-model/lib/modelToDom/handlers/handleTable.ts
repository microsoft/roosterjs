import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
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

        applyFormat(tableNode, context.formatAppliers.table, table.format, context);
        applyFormat(tableNode, context.formatAppliers.dataset, table.dataset, context);
    }

    applyFormat(tableNode, context.formatAppliers.tableBorder, table.format, context);

    const tbody = doc.createElement('tbody');
    tableNode.appendChild(tbody);

    for (let row = 0; row < table.cells.length; row++) {
        if (table.cells[row].length == 0) {
            // Skip empty row
            continue;
        }

        const tr = doc.createElement('tr');
        tbody.appendChild(tr);

        for (let col = 0; col < table.cells[row].length; col++) {
            const cell = table.cells[row][col];

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

                if (!cell.cachedElement) {
                    cell.cachedElement = td;
                    applyFormat(td, context.formatAppliers.tableCell, cell.format, context);
                    applyFormat(td, context.formatAppliers.dataset, cell.dataset, context);
                }

                applyFormat(td, context.formatAppliers.tableCellBorder, cell.format, context);

                let rowSpan = 1;
                let colSpan = 1;
                let width = table.widths[col];
                let height = table.heights[row];

                for (; table.cells[row + rowSpan]?.[col]?.spanAbove; rowSpan++) {
                    height += table.heights[row + rowSpan];
                }
                for (; table.cells[row][col + colSpan]?.spanLeft; colSpan++) {
                    width += table.widths[col + colSpan];
                }

                td.style.width = width + 'px';
                td.style.height = height + 'px';

                if (rowSpan > 1) {
                    td.rowSpan = rowSpan;
                }

                if (colSpan > 1) {
                    td.colSpan = colSpan;
                }

                context.modelHandlers.blockGroupChildren(doc, td, cell, context);
            }
        }
    }

    return refNode;
};
