import { addBlock, createTable, createTableCell } from 'roosterjs-content-model-dom';
import { ContentModelBlockGroup, ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createTableStructure(
    parent: ContentModelBlockGroup,
    columns: number,
    rows: number
): ContentModelTable {
    const table = createTable(rows);

    addBlock(parent, table);

    table.rows.forEach(row => {
        for (let i = 0; i < columns; i++) {
            const cell = createTableCell();

            row.cells.push(cell);
        }
    });

    return table;
}
