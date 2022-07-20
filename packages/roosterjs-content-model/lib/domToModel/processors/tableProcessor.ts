import { addBlock } from '../utils/addBlock';
import { containerProcessor } from './containerProcessor';
import { createTable } from '../creators/createTable';
import { createTableCell } from '../creators/createTableCell';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 *
 * For Table with merged/splitted cells, HTML uses colSpan and rowSpan attributes to specify how it should be rendered.
 * To make it easier to edit a table, we will use a different way to describe table.
 *
 * 1. For a m * n table (m rows, n columns), we always create a m * n array for the cells.
 * 2. For a regular table cell, it is mapped to one item of this array
 * 3. For a merged/splitted table cell, it will has colSpan/rowSpan value. We also created TableCell model for those spanned
 * cells, and use "spanLeft" and "spanAbove" to mark its state
 * 4. When edit table, we always edit on this mapped m * n array because it always has an item for each cell
 * 5. When write back to DOM, we create TD/TH elements for those non-spanned cells, and mark its colSpan/rowSpan value according
 * its neighbour cell's spanLeft/spanAbove attribute
 */
export const tableProcessor: ElementProcessor = (group, element) => {
    const tableElement = element as HTMLTableElement;
    const table = createTable(tableElement.rows.length);

    addBlock(group, table);

    for (let row = 0; row < tableElement.rows.length; row++) {
        const tr = tableElement.rows[row];
        for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
            for (; table.cells[row][targetCol]; targetCol++) {}

            const td = tr.cells[sourceCol];

            for (let colSpan = 1; colSpan <= td.colSpan; colSpan++, targetCol++) {
                for (let rowSpan = 1; rowSpan <= td.rowSpan; rowSpan++) {
                    const hasTd = colSpan == 1 && rowSpan == 1;
                    const cell = createTableCell(colSpan, rowSpan, td.tagName == 'TH');

                    table.cells[row + rowSpan - 1][targetCol] = cell;

                    if (hasTd) {
                        containerProcessor(cell, td);
                    }
                }
            }
        }
    }
};
