import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { getSelectedCells } from '../../../lib/modelApi/table/getSelectedCells';

describe('getSelectedCells', () => {
    it('empty table', () => {
        const table = createTable(0);
        const selection = getSelectedCells(table);

        expect(selection).toBeNull();
    });

    it('table without selection', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());
        const selection = getSelectedCells(table);

        expect(selection).toBeNull();
    });

    it('table with segment selection', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());
        const br = createBr();
        br.isSelected = true;
        addSegment(table.rows[1].cells[1], br);

        const selection = getSelectedCells(table);

        expect(selection).toEqual({
            firstRow: 1,
            firstCol: 1,
            lastRow: 1,
            lastCol: 1,
        });
    });

    it('table with single cell selection', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());
        table.rows[0].cells[1].isSelected = true;

        const selection = getSelectedCells(table);

        expect(selection).toEqual({
            firstRow: 0,
            firstCol: 1,
            lastRow: 0,
            lastCol: 1,
        });
    });

    it('table with multi cell selection', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());
        table.rows[0].cells[0].isSelected = true;
        table.rows[1].cells[1].isSelected = true;

        const selection = getSelectedCells(table);

        expect(selection).toEqual({
            firstRow: 0,
            firstCol: 0,
            lastRow: 1,
            lastCol: 1,
        });
    });
});
