import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { insertTableRow } from '../../../lib/modelApi/table/insertTableRow';
import { TableOperation } from 'roosterjs-editor-types';

describe('insertTableRow', () => {
    it('empty table', () => {
        const table = createTable(0);
        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
        });

        insertTableRow(table, TableOperation.InsertBelow);
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

        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell1]],
            widths: [],
            heights: [],
        });

        insertTableRow(table, TableOperation.InsertBelow);
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

        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell2], [cell1]],
            widths: [100],
            heights: [200, 200],
        });

        insertTableRow(table, TableOperation.InsertBelow);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell2], [cell1], [cell2]],
            widths: [100],
            heights: [200, 200, 200],
        });
    });

    it('table with multi selection', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell(false, false, true);
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

        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell3], [cell3], [cell1], [cell2]],
            widths: [100],
            heights: [200, 200, 200, 300],
        });

        insertTableRow(table, TableOperation.InsertBelow);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [[cell3], [cell3], [cell1], [cell2], [cell4], [cell4]],
            widths: [100],
            heights: [200, 200, 200, 300, 300, 300],
        });
    });

    it('table with multi selection in multi column', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, true);
        const cell2 = createTableCell(false, true);

        cell1.isSelected = true;
        cell2.isSelected = true;
        table.cells[0].push(cell1, cell2);
        table.widths = [100, 200];
        table.heights = [300];

        const cell3 = { ...cell1 };
        delete cell3.isSelected;

        const cell4 = { ...cell2 };
        delete cell4.isSelected;

        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell3, cell4],
                [cell1, cell2],
            ],
            widths: [100, 200],
            heights: [300, 300],
        });

        insertTableRow(table, TableOperation.InsertBelow);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell3, cell4],
                [cell1, cell2],
                [cell3, cell4],
            ],
            widths: [100, 200],
            heights: [300, 300, 300],
        });
    });

    it('table with complex scenario', () => {
        const table = createTable(4);
        const cell1 = createTableCell(false, false, false, { backgroundColor: '1' });
        const cell2 = createTableCell(false, false, false, { backgroundColor: '2' });
        const cell3 = createTableCell(false, false, false, { backgroundColor: '3' });
        const cell4 = createTableCell(false, false, false, { backgroundColor: '4' });
        const cell5 = createTableCell(false, false, false, { backgroundColor: '5' });
        const cell6 = createTableCell(true, false, false, { backgroundColor: '6' });
        const cell7 = createTableCell(false, false, false, { backgroundColor: '7' });
        const cell8 = createTableCell(false, true, false, { backgroundColor: '8' });
        const cell9 = createTableCell(true, true, false, { backgroundColor: '9' });
        const cell10 = createTableCell(false, false, false, { backgroundColor: '10' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });

        cell5.isSelected = true;
        cell9.isSelected = true;
        table.cells[0].push(cell1, cell2, cell3);
        table.cells[1].push(cell4, cell5, cell6);
        table.cells[2].push(cell7, cell8, cell9);
        table.cells[3].push(cell10, cell11, cell12);
        table.widths = [100, 200, 300];
        table.heights = [400, 500, 600, 700];

        const cell5Clone = { ...cell5 };
        const cell9Clone = { ...cell9 };
        delete cell5Clone.isSelected;
        delete cell9Clone.isSelected;

        insertTableRow(table, TableOperation.InsertAbove);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell1, cell2, cell3],
                [cell4, cell5Clone, cell6],
                [cell4, cell5Clone, cell6],
                [cell4, cell5, cell6],
                [cell7, cell8, cell9],
                [cell10, cell11, cell12],
            ],
            widths: [100, 200, 300],
            heights: [400, 500, 500, 500, 600, 700],
        });

        insertTableRow(table, TableOperation.InsertBelow);
        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cell1, cell2, cell3],
                [cell4, cell5Clone, cell6],
                [cell4, cell5Clone, cell6],
                [cell4, cell5, cell6],
                [cell7, cell8, cell9],
                [cell7, cell8, cell9Clone],
                [cell7, cell8, cell9Clone],
                [cell10, cell11, cell12],
            ],
            widths: [100, 200, 300],
            heights: [400, 500, 500, 500, 600, 600, 600, 700],
        });
    });
});
