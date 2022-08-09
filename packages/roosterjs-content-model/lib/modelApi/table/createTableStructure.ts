import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';

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

    table.cells.forEach(row => {
        for (let i = 0; i < columns; i++) {
            const cell = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, false /*isHeader*/);

            row.push(cell);
        }
    });

    return table;
}
