import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { handleBlock } from './handleBlock';
import { tempHandleAttributes } from './tempHandleAttributes';

/**
 * @internal
 */
export function handleTable(doc: Document, parent: Node, table: ContentModelTable) {
    const tableNode = doc.createElement('table');
    parent.appendChild(tableNode);
    tempHandleAttributes(tableNode, table.tempAttributes);

    const tbody = doc.createElement('tbody');
    tableNode.appendChild(tbody);

    for (let row = 0; row < table.cells.length; row++) {
        const tr = doc.createElement('tr');
        tbody.appendChild(tr);

        for (let col = 0; col < table.cells[row].length; col++) {
            const cell = table.cells[row][col];

            if (!cell.spanAbove && !cell.spanLeft) {
                const td = doc.createElement(cell.isHeader ? 'th' : 'td');
                tr.appendChild(td);
                tempHandleAttributes(td, cell.tempAttributes);

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
