import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { insertTableColumn } from '../../../lib/modelApi/table/insertTableColumn';
import { TableOperation } from 'roosterjs-editor-types';

describe('insertTableColumn', () => {
    it('empty table', () => {
        const table = createTable(0);
        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
        });
    });

    it('table without selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        table.cells[0].push(cell1);

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell1]],
            widths: [],
            heights: [],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell1]],
            widths: [],
            heights: [],
        });
    });

    it('table with single selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        cell1.isSelected = true;
        table.cells[0].push(cell1);
        table.widths = [100];
        table.heights = [200];

        const cell2 = { ...cell1 };
        delete cell2.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell2, cell1]],
            widths: [100, 100],
            heights: [200],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell2, cell1, cell2]],
            widths: [100, 100, 100],
            heights: [200],
        });
    });

    it('table with multi selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell(false, false, true);
        cell1.isSelected = true;
        cell2.isSelected = true;
        table.cells[0].push(cell1, cell2);
        table.widths = [100, 200];
        table.heights = [300];

        const cell3 = { ...cell1 };
        delete cell3.isSelected;

        const cell4 = { ...cell2 };
        delete cell4.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell3, cell3, cell1, cell2]],
            widths: [100, 100, 100, 200],
            heights: [300],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell3, cell3, cell1, cell2, cell4, cell4]],
            widths: [100, 100, 100, 200, 200, 200],
            heights: [300],
        });
    });

    it('table with multi selection in multi row', () => {
        const table = createTable(2);
        const cell1 = createTableCell(false, false, true);
        const cell2 = createTableCell(false, true);

        cell1.isSelected = true;
        cell2.isSelected = true;
        table.cells[0].push(cell1);
        table.cells[1].push(cell2);
        table.widths = [100];
        table.heights = [200, 300];

        const cell3 = { ...cell1 };
        delete cell3.isSelected;

        const cell4 = { ...cell2 };
        delete cell4.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell3, cell1],
                [cell4, cell2],
            ],
            widths: [100, 100],
            heights: [200, 300],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell3, cell1, cell3],
                [cell4, cell2, cell4],
            ],
            widths: [100, 100, 100],
            heights: [200, 300],
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
        table.cells[0].push(cell1, cell2, cell3, cell4);
        table.cells[1].push(cell5, cell6, cell7, cell8);
        table.cells[2].push(cell9, cell10, cell11, cell12);
        table.widths = [100, 200, 300, 400];
        table.heights = [500, 600, 700];

        const cell6Clone = { ...cell6 };
        const cell11Clone = { ...cell11 };
        delete cell6Clone.isSelected;
        delete cell11Clone.isSelected;

        insertTableColumn(table, TableOperation.InsertLeft);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell1, cell2, cell2, cell2, cell3, cell4],
                [cell5, cell6Clone, cell6Clone, cell6, cell7, cell8],
                [cell9, cell10, cell10, cell10, cell11, cell12],
            ],
            widths: [100, 200, 200, 200, 300, 400],
            heights: [500, 600, 700],
        });

        insertTableColumn(table, TableOperation.InsertRight);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell1, cell2, cell2, cell2, cell3, cell3, cell3, cell4],
                [cell5, cell6Clone, cell6Clone, cell6, cell7, cell7, cell7, cell8],
                [cell9, cell10, cell10, cell10, cell11, cell11Clone, cell11Clone, cell12],
            ],
            widths: [100, 200, 200, 200, 300, 300, 300, 400],
            heights: [500, 600, 700],
        });
    });
});
