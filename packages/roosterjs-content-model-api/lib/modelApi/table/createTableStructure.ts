import { addBlock, createTable, createTableCell } from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    ContentModelTable,
    ContentModelTableCellFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createTableStructure(
    parent: ContentModelBlockGroup,
    columns: number,
    rows: number,
    cellFormat?: ContentModelTableCellFormat
): ContentModelTable {
    const table = createTable(rows);

    addBlock(parent, table);

    table.rows.forEach(row => {
        for (let i = 0; i < columns; i++) {
            const cell = createTableCell(
                undefined /*spanLeftOrColSpan */,
                undefined /*spanAboveOrRowSpan */,
                undefined /* isHeader */,
                cellFormat
            );

            row.cells.push(cell);
        }
    });

    return table;
}
