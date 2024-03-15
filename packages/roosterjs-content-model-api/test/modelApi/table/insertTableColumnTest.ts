import { createTable, createTableCell } from 'roosterjs-content-model-dom';
import { insertTableColumn } from '../../../lib/modelApi/table/insertTableColumn';

describe('insertTableColumn', () => {
    it('empty table', () => {
        const table = createTable(0);
        insertTableColumn(table, 'insertLeft');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });

        insertTableColumn(table, 'insertRight');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('table without selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        table.rows[0].cells.push(cell1);

        insertTableColumn(table, 'insertLeft');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 0, cells: [cell1] }],
            widths: [],
            dataset: {},
        });

        insertTableColumn(table, 'insertRight');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 0, cells: [cell1] }],
            widths: [],
            dataset: {},
        });
    });

    it('table with single selection', () => {
        const table = createTable(1);
        const selectedCell = createTableCell();
        selectedCell.isSelected = true;
        table.rows[0].cells.push({ ...selectedCell });
        table.widths = [100];
        table.rows[0].height = 200;

        const unselectedCell = { ...selectedCell };
        unselectedCell.isSelected = false;

        insertTableColumn(table, 'insertLeft');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 200, cells: [selectedCell, unselectedCell] }],
            widths: [100, 100],
            dataset: {},
        });

        insertTableColumn(table, 'insertRight');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 200, cells: [unselectedCell, selectedCell, unselectedCell] },
            ],
            widths: [100, 100, 100],
            dataset: {},
        });
    });

    it('table with multi selection - insertLeft', () => {
        const table = createTable(1);
        const selectedCell = createTableCell();
        const selectedHeader = createTableCell(false, false, true);
        selectedCell.isSelected = true;
        selectedHeader.isSelected = true;
        table.rows[0].cells.push({ ...selectedCell }, { ...selectedHeader });
        table.widths = [100, 200];
        table.rows[0].height = 300;

        const unselectedCell = { ...selectedCell, isSelected: false };
        const unselectedHeader = { ...selectedHeader, isSelected: false };

        insertTableColumn(table, 'insertLeft');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 300,
                    cells: [selectedCell, selectedCell, unselectedCell, unselectedHeader],
                },
            ],
            widths: [100, 100, 100, 200],
            dataset: {},
        });
    });

    it('table with multi selection - insertRight', () => {
        const table = createTable(1);
        const selectedCell = createTableCell();
        const selectedHeader = createTableCell(false, false, true);
        selectedCell.isSelected = true;
        selectedHeader.isSelected = true;
        table.rows[0].cells.push({ ...selectedCell }, { ...selectedHeader });
        table.widths = [100, 200];
        table.rows[0].height = 300;

        const unselectedCell = { ...selectedCell, isSelected: false };
        const unselectedHeader = { ...selectedHeader, isSelected: false };

        insertTableColumn(table, 'insertRight');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 300,
                    cells: [unselectedCell, unselectedHeader, selectedHeader, selectedHeader],
                },
            ],
            widths: [100, 200, 200, 200],
            dataset: {},
        });
    });

    it('table with multi selection in multi row', () => {
        const table = createTable(2);
        const selectedHeader = createTableCell(false, false, true);
        const selectedSpanAbove = createTableCell(false, true);

        selectedHeader.isSelected = true;
        selectedSpanAbove.isSelected = true;
        table.rows[0].cells.push({ ...selectedHeader });
        table.rows[1].cells.push({ ...selectedSpanAbove });
        table.widths = [100];
        table.rows[0].height = 200;
        table.rows[1].height = 300;

        const unselectedHeader = { ...selectedHeader, isSelected: false };
        const unselectedSpanAbove = { ...selectedSpanAbove, isSelected: false };

        insertTableColumn(table, 'insertLeft');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 200, cells: [selectedHeader, unselectedHeader] },
                { format: {}, height: 300, cells: [selectedSpanAbove, unselectedSpanAbove] },
            ],
            widths: [100, 100],
            dataset: {},
        });

        insertTableColumn(table, 'insertRight');
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [unselectedHeader, selectedHeader, unselectedHeader],
                },
                {
                    format: {},
                    height: 300,
                    cells: [unselectedSpanAbove, selectedSpanAbove, unselectedSpanAbove],
                },
            ],
            widths: [100, 100, 100],
            dataset: {},
        });
    });

    it('table with complex scenario - insertLeft', () => {
        const table = createTable(4);
        const cell1 = createTableCell(false, false, false, { backgroundColor: '1' });
        const cell2 = createTableCell(false, false, false, { backgroundColor: '2' });
        const cell3 = createTableCell(false, false, false, { backgroundColor: '3' });
        const cell4 = createTableCell(false, false, false, { backgroundColor: '4' });
        const selectedCell5 = createTableCell(false, false, false, { backgroundColor: '5' });
        const cell6 = createTableCell(true, false, false, { backgroundColor: '6' });
        const cell7 = createTableCell(false, false, false, { backgroundColor: '7' });
        const cell8 = createTableCell(false, true, false, { backgroundColor: '8' });
        const selectedCell9 = createTableCell(true, true, false, { backgroundColor: '9' });
        const cell10 = createTableCell(false, false, false, { backgroundColor: '10' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });

        selectedCell5.isSelected = true;
        selectedCell9.isSelected = true;
        table.rows[0].cells.push(cell1, cell2, cell3);
        table.rows[1].cells.push(cell4, { ...selectedCell5 }, cell6);
        table.rows[2].cells.push(cell7, cell8, { ...selectedCell9 });
        table.rows[3].cells.push(cell10, cell11, cell12);
        table.widths = [100, 200, 300];
        table.rows[0].height = 400;
        table.rows[1].height = 500;
        table.rows[2].height = 600;
        table.rows[3].height = 700;

        const unselectedCell5 = { ...selectedCell5, isSelected: false };
        const unselectedCell9 = { ...selectedCell9, isSelected: false };

        insertTableColumn(table, 'insertLeft');

        const selectedCell2 = { ...cell2, isSelected: true };
        const selectedCell8 = { ...cell8, isSelected: true };
        const selectedCell11 = { ...cell11, isSelected: true };

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 400,
                    cells: [cell1, selectedCell2, selectedCell2, cell2, cell3],
                },
                {
                    format: {},
                    height: 500,
                    cells: [cell4, selectedCell5, selectedCell5, unselectedCell5, cell6],
                },
                {
                    format: {},
                    height: 600,
                    cells: [cell7, selectedCell8, selectedCell8, cell8, unselectedCell9],
                },
                {
                    format: {},
                    height: 700,
                    cells: [cell10, selectedCell11, selectedCell11, cell11, cell12],
                },
            ],
            widths: [100, 200, 200, 200, 300],
            dataset: {},
        });
    });

    it('table with complex scenario - insertRight', () => {
        const table = createTable(4);
        const cell1 = createTableCell(false, false, false, { backgroundColor: '1' });
        const cell2 = createTableCell(false, false, false, { backgroundColor: '2' });
        const cell3 = createTableCell(false, false, false, { backgroundColor: '3' });
        const cell4 = createTableCell(false, false, false, { backgroundColor: '4' });
        const selectedCell5 = createTableCell(false, false, false, { backgroundColor: '5' });
        const cell6 = createTableCell(true, false, false, { backgroundColor: '6' });
        const cell7 = createTableCell(false, false, false, { backgroundColor: '7' });
        const cell8 = createTableCell(false, true, false, { backgroundColor: '8' });
        const selectedCell9 = createTableCell(true, true, false, { backgroundColor: '9' });
        const cell10 = createTableCell(false, false, false, { backgroundColor: '10' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });

        selectedCell5.isSelected = true;
        selectedCell9.isSelected = true;
        table.rows[0].cells.push(cell1, cell2, cell3);
        table.rows[1].cells.push(cell4, { ...selectedCell5 }, cell6);
        table.rows[2].cells.push(cell7, cell8, { ...selectedCell9 });
        table.rows[3].cells.push(cell10, cell11, cell12);
        table.widths = [100, 200, 300];
        table.rows[0].height = 400;
        table.rows[1].height = 500;
        table.rows[2].height = 600;
        table.rows[3].height = 700;

        const unselectedCell5 = { ...selectedCell5, isSelected: false };
        const unselectedCell9 = { ...selectedCell9, isSelected: false };

        insertTableColumn(table, 'insertRight');

        const selectedCell3 = { ...cell3, isSelected: true };
        const selectedCell6 = { ...cell6, isSelected: true };
        const selectedCell12 = { ...cell12, isSelected: true };

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 400,
                    cells: [cell1, cell2, cell3, selectedCell3, selectedCell3],
                },
                {
                    format: {},
                    height: 500,
                    cells: [cell4, unselectedCell5, cell6, selectedCell6, selectedCell6],
                },
                {
                    format: {},
                    height: 600,
                    cells: [cell7, cell8, unselectedCell9, selectedCell9, selectedCell9],
                },
                {
                    format: {},
                    height: 700,
                    cells: [cell10, cell11, cell12, selectedCell12, selectedCell12],
                },
            ],
            widths: [100, 200, 300, 300, 300],
            dataset: {},
        });
    });
});
