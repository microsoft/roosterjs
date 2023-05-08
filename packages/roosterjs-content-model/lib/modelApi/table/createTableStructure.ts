import { addBlock } from '../common/addBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTable } from '../creators/createTable';
import { createTableCell } from '../creators/createTableCell';

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
