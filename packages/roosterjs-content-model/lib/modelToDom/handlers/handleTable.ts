import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { handleBlock } from './handleBlock';

/**
 * @internal
 */
export function handleTable(doc: Document, parent: Node, table: ContentModelTable) {
    if (table.cells.length == 0 || table.cells.every(c => c.length == 0)) {
        // Empty table, do not create TABLE element and just return
        return;
    }

    const tableNode = doc.createElement('table');
    parent.appendChild(tableNode);

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

            if (!cell.spanAbove && !cell.spanLeft) {
                const td = doc.createElement(cell.isHeader ? 'th' : 'td');
                tr.appendChild(td);

                let rowSpan = 1;
                let colSpan = 1;

                for (; table.cells[row + rowSpan]?.[col]?.spanAbove; rowSpan++) {}
                for (; table.cells[row][col + colSpan]?.spanLeft; colSpan++) {}

                if (rowSpan > 1) {
                    td.rowSpan = rowSpan;
                }

                if (colSpan > 1) {
                    td.colSpan = colSpan;
                }

                handleBlock(doc, td, cell);
            }
        }
    }
}
