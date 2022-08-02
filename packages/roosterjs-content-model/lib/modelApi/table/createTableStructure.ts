import { addBlock } from '../../domToModel/utils/addBlock';
import { addSegment } from '../../domToModel/utils/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createBr } from '../../domToModel/creators/createBr';
import { createDomToModelContext } from '../../domToModel/context/createDomToModelContext';
import { createTable } from '../../domToModel/creators/createTable';
import { createTableCell } from '../../domToModel/creators/createTableCell';

/**
 * @internal
 */
export function createTableStructure(
    parent: ContentModelBlockGroup,
    columns: number,
    rows: number,
    contentModelContext: ContentModelContext
): ContentModelTable {
    const table = createTable(rows);
    const width = getTableCellWidth(columns);
    const context = createDomToModelContext(contentModelContext);

    addBlock(parent, table);

    table.format.borderCollapse = true;
    table.cells.forEach(row => {
        for (let i = 0; i < columns; i++) {
            const cell = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, false /*isHeader*/, context);

            addSegment(cell, createBr(context));
            row.push(cell);

            cell.format.width = width;
        }
    });

    return table;
}

function getTableCellWidth(columns: number): number {
    if (columns <= 4) {
        return 120;
    } else if (columns <= 6) {
        return 100;
    } else {
        return 70;
    }
}
