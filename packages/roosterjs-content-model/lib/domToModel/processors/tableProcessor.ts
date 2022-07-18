import { addBlock } from '../utils/addBlock';
import { containerProcessor } from './containerProcessor';
import { createTable } from '../creators/createTable';
import { createTableCell } from '../creators/createTableCell';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const tableProcessor: ElementProcessor = (group, element) => {
    const tableElement = element as HTMLTableElement;
    const table = createTable(tableElement);

    addBlock(group, table);

    for (let row = 0; row < tableElement.rows.length; row++) {
        const tr = tableElement.rows[row];
        for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
            for (; table.cells[row][targetCol]; targetCol++) {}

            const td = tr.cells[sourceCol];

            for (let colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                for (let rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                    const hasTd = colSpan + rowSpan == 0;
                    const cell = createTableCell(
                        colSpan,
                        rowSpan,
                        td.tagName == 'TH',
                        hasTd ? td : null
                    );

                    table.cells[row + rowSpan][targetCol] = cell;

                    if (hasTd) {
                        containerProcessor(cell, td);
                    }
                }
            }
        }
    }
};
