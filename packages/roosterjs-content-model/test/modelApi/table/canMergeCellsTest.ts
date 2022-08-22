import { canMergeCells } from '../../../lib/modelApi/table/canMergeCells';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';

describe('canMergeCells', () => {
    it('Single cell table', () => {
        const table = createTable(1);
        table.cells[0].push(createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 0, 0);
        expect(canMerge).toBeTrue();
    });

    it('Multi cell table, merge single cell', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 1, 1, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Multi cell table, merge in column', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 1, 1, 2, 1);
        expect(canMerge).toBeTrue();
    });

    it('Multi cell table, merge in row', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 1, 1, 1, 2);
        expect(canMerge).toBeTrue();
    });

    it('Cannot merge with above span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell(false, true));
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 1, 1, 2, 2);
        expect(canMerge).toBeFalse();
    });

    it('Cannot merge with left span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(true), createTableCell());

        const canMerge = canMergeCells(table.cells, 1, 1, 2, 2);
        expect(canMerge).toBeFalse();
    });

    it('Cannot merge with different below span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(false, true), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeFalse();
    });

    it('Cannot merge with different right span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell(true));
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeFalse();
    });

    it('Can merge with unrelated above span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell(false, true));
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with unrelated left span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(true), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with inner left span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(true), createTableCell());
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with inner above span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(false, true), createTableCell(), createTableCell());
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with inner both span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(true), createTableCell());
        table.cells[1].push(
            createTableCell(false, true),
            createTableCell(true, true),
            createTableCell()
        );
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with same extra left span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(true), createTableCell(true));
        table.cells[1].push(createTableCell(), createTableCell(), createTableCell(true));
        table.cells[2].push(createTableCell(), createTableCell(), createTableCell());

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });

    it('Can merge with same extra above span', () => {
        const table = createTable(3);
        table.cells[0].push(createTableCell(), createTableCell(), createTableCell());
        table.cells[1].push(createTableCell(false, true), createTableCell(), createTableCell());
        table.cells[2].push(
            createTableCell(false, true),
            createTableCell(false, true),
            createTableCell()
        );

        const canMerge = canMergeCells(table.cells, 0, 0, 1, 1);
        expect(canMerge).toBeTrue();
    });
});
