import hasSelectionInBlock from '../../../lib/publicApi/selection/hasSelectionInBlock';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { deleteTableColumn } from '../../../lib/modelApi/table/deleteTableColumn';

describe('deleteTableColumn', () => {
    it('empty table', () => {
        const table = createTable(0);
        deleteTableColumn(table);
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
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ cells: [cell1, cell2], format: {}, height: 0 }],
            widths: [],
            dataset: {},
        });
    });

    it('table with selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);

        cell1.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ cells: [cell2], format: {}, height: 0 }],
            widths: [],
            dataset: {},
        });

        expect(cell2.blocks.some(hasSelectionInBlock)).toBeTrue();
    });

    it('table with selection in middle', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        table.rows[0].cells.push(cell1, cell2, cell3);

        cell2.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell3] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell3.blocks.some(hasSelectionInBlock)).toBeTrue();
    });

    it('table with selection at end', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        table.rows[0].cells.push(cell1, cell2, cell3);

        cell3.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell2] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell2.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with multiple selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        table.rows[0].cells.push(cell1, cell2, cell3);

        cell2.isSelected = true;
        cell3.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with full selection', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        table.rows[0].cells.push(cell1, cell2, cell3);

        cell1.isSelected = true;
        cell3.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [] }],
            widths: [],
            dataset: {},
        });
    });

    it('table with selection spanned cell - 1', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(true, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2, cell3, cell4);

        cell2.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell3, cell4] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.spanLeft).toBeFalse();
        expect(cell3.spanLeft).toBeFalse();
        expect(cell4.spanLeft).toBeFalse();

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell3.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection spanned cell - 2', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(true, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2, cell3, cell4);

        cell2.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell3, cell4] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.spanLeft).toBeFalse();
        expect(cell3.spanLeft).toBeFalse();
        expect(cell4.spanLeft).toBeFalse();

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell3.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection spanned cell - 3', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(true, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(true, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2, cell3, cell4);

        cell2.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell3, cell4] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.spanLeft).toBeFalse();
        expect(cell3.spanLeft).toBeTrue();
        expect(cell4.spanLeft).toBeFalse();

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell3.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection spanned cell - 4', () => {
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(true, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(true, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2, cell3, cell4);

        cell3.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [{ height: 0, format: {}, cells: [cell1, cell2, cell4] }],
            widths: [],
            dataset: {},
        });

        expect(cell1.spanLeft).toBeFalse();
        expect(cell2.spanLeft).toBeTrue();
        expect(cell4.spanLeft).toBeFalse();

        expect(cell1.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell2.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeTrue();
    });

    it('table with selection and multi columns', () => {
        const table = createTable(2);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        cell1.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { height: 0, format: {}, cells: [cell2] },
                { height: 0, format: {}, cells: [cell4] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cell2.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection and multi columns and colspan', () => {
        const table = createTable(2);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, true, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        cell1.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { height: 0, format: {}, cells: [cell2] },
                { height: 0, format: {}, cells: [cell4] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cell2.spanAbove).toBeFalse();
        expect(cell4.spanAbove).toBeTrue();

        expect(cell2.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection and multi columns and colspan', () => {
        const table = createTable(2);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, true, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        cell1.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { height: 0, format: {}, cells: [cell2] },
                { height: 0, format: {}, cells: [cell4] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cell2.spanAbove).toBeFalse();
        expect(cell4.spanAbove).toBeFalse();

        expect(cell2.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell4.blocks.some(hasSelectionInBlock)).toBeFalse();
    });

    it('table with selection and multi columns and multi span', () => {
        const table = createTable(3);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(true, false, false, { textAlign: 'end' });
        const cell4 = createTableCell(false, false, false, { verticalAlign: 'top' });
        const cell5 = createTableCell(false, true, false, { verticalAlign: 'middle' });
        const cell6 = createTableCell(true, true, false, { verticalAlign: 'bottom' });
        const cell7 = createTableCell(false, false, false, { backgroundColor: 'red' });
        const cell8 = createTableCell(false, false, false, { backgroundColor: 'yellow' });
        const cell9 = createTableCell(false, false, false, { backgroundColor: 'blue' });
        table.rows[0].cells.push(cell1, cell2, cell3);
        table.rows[1].cells.push(cell4, cell5, cell6);
        table.rows[2].cells.push(cell7, cell8, cell9);

        cell7.isSelected = true;

        deleteTableColumn(table);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { height: 0, format: {}, cells: [cell2, cell3] },
                { height: 0, format: {}, cells: [cell5, cell6] },
                { height: 0, format: {}, cells: [cell8, cell9] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cell2.spanLeft).toBeFalse();
        expect(cell2.spanAbove).toBeFalse();
        expect(cell3.spanLeft).toBeTrue();
        expect(cell3.spanAbove).toBeFalse();
        expect(cell5.spanLeft).toBeFalse();
        expect(cell5.spanAbove).toBeTrue();
        expect(cell6.spanLeft).toBeTrue();
        expect(cell6.spanAbove).toBeTrue();
        expect(cell8.spanLeft).toBeFalse();
        expect(cell8.spanAbove).toBeFalse();
        expect(cell9.spanLeft).toBeFalse();
        expect(cell9.spanAbove).toBeFalse();

        expect(cell8.blocks.some(hasSelectionInBlock)).toBeTrue();
        expect(cell2.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell3.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell5.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell6.blocks.some(hasSelectionInBlock)).toBeFalse();
        expect(cell9.blocks.some(hasSelectionInBlock)).toBeFalse();
    });
});
