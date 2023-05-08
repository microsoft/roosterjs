import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { insertTableColumn } from '../../../lib/modelApi/table/insertTableColumn';
import { TableOperation } from 'roosterjs-editor-types';

describe('insertTableColumn', () => {
    it('empty table', () => {
        const table = createTable(0);
        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
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

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 0, cells: [cell1] }],
            widths: [],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
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
        const cell1 = createTableCell();
        cell1.isSelected = true;
        table.rows[0].cells.push(cell1);
        table.widths = [100];
        table.rows[0].height = 200;

        const cell2 = { ...cell1 };
        delete cell2.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 200, cells: [cell2, cell1] }],
            widths: [100, 100],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 200, cells: [cell2, cell1, cell2] }],
            widths: [100, 100, 100],
            dataset: {},
        });
    });

    it('table with multi selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell(false, false, true);
        cell1.isSelected = true;
        cell2.isSelected = true;
        table.rows[0].cells.push(cell1, cell2);
        table.widths = [100, 200];
        table.rows[0].height = 300;

        const cell3 = { ...cell1 };
        delete cell3.isSelected;

        const cell4 = { ...cell2 };
        delete cell4.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 300, cells: [cell3, cell3, cell1, cell2] }],
            widths: [100, 100, 100, 200],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ format: {}, height: 300, cells: [cell3, cell3, cell1, cell2, cell4, cell4] }],
            widths: [100, 100, 100, 200, 200, 200],
            dataset: {},
        });
    });

    it('table with multi selection in multi row', () => {
        const table = createTable(2);
        const cell1 = createTableCell(false, false, true);
        const cell2 = createTableCell(false, true);

        cell1.isSelected = true;
        cell2.isSelected = true;
        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);
        table.widths = [100];
        table.rows[0].height = 200;
        table.rows[1].height = 300;

        const cell3 = { ...cell1 };
        delete cell3.isSelected;

        const cell4 = { ...cell2 };
        delete cell4.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 200, cells: [cell3, cell1] },
                { format: {}, height: 300, cells: [cell4, cell2] },
            ],
            widths: [100, 100],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 200, cells: [cell3, cell1, cell3] },
                { format: {}, height: 300, cells: [cell4, cell2, cell4] },
            ],
            widths: [100, 100, 100],
            dataset: {},
        });
    });

    it('table with complex scenario', () => {
        const table = createTable(3);
        const cell1 = createTableCell(false, false, false, { backgroundColor: '1' });
        const cell2 = createTableCell(false, false, false, { backgroundColor: '2' });
        const cell3 = createTableCell(false, false, false, { backgroundColor: '3' });
        const cell4 = createTableCell(false, false, false, { backgroundColor: '4' });
        const cell5 = createTableCell(false, false, false, { backgroundColor: '5' });
        const cell6 = createTableCell(false, false, false, { backgroundColor: '6' });
        const cell7 = createTableCell(true, false, false, { backgroundColor: '7' });
        const cell8 = createTableCell(false, false, false, { backgroundColor: '8' });
        const cell9 = createTableCell(false, false, false, { backgroundColor: '9' });
        const cell10 = createTableCell(false, true, false, { backgroundColor: '10' });
        const cell11 = createTableCell(true, true, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });

        cell6.isSelected = true;
        cell11.isSelected = true;
        table.rows[0].cells.push(cell1, cell2, cell3, cell4);
        table.rows[1].cells.push(cell5, cell6, cell7, cell8);
        table.rows[2].cells.push(cell9, cell10, cell11, cell12);
        table.widths = [100, 200, 300, 400];
        table.rows[0].height = 500;
        table.rows[1].height = 600;
        table.rows[2].height = 700;

        const cell6Clone = { ...cell6 };
        const cell11Clone = { ...cell11 };
        delete cell6Clone.isSelected;
        delete cell11Clone.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 500, cells: [cell1, cell2, cell2, cell2, cell3, cell4] },
                {
                    format: {},
                    height: 600,
                    cells: [cell5, cell6Clone, cell6Clone, cell6, cell7, cell8],
                },
                { format: {}, height: 700, cells: [cell9, cell10, cell10, cell10, cell11, cell12] },
            ],
            widths: [100, 200, 200, 200, 300, 400],
            dataset: {},
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 500,
                    cells: [cell1, cell2, cell2, cell2, cell3, cell3, cell3, cell4],
                },
                {
                    format: {},
                    height: 600,
                    cells: [cell5, cell6Clone, cell6Clone, cell6, cell7, cell7, cell7, cell8],
                },
                {
                    format: {},
                    height: 700,
                    cells: [
                        cell9,
                        cell10,
                        cell10,
                        cell10,
                        cell11,
                        cell11Clone,
                        cell11Clone,
                        cell12,
                    ],
                },
            ],
            widths: [100, 200, 200, 200, 300, 300, 300, 400],
            dataset: {},
        });
    });
});
