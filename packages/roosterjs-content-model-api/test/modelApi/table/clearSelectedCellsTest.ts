import { clearSelectedCells } from '../../../lib/modelApi/table/clearSelectedCells';
import { createSelectionMarker, createTable, createTableCell } from 'roosterjs-content-model-dom';

describe('clearSelectedCells', () => {
    it('invalid selection to clear', () => {
        const table = createTable(2);
        const selectedCell = createTableCell();
        selectedCell.isSelected = true;
        table.rows.forEach(row => {
            row.cells.push(selectedCell, selectedCell), (row.height = 200);
        });

        clearSelectedCells(table, { firstRow: 0, lastRow: 2, firstColumn: 0, lastColumn: 2 });
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, selectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, selectedCell],
                },
            ],
            widths: [],
            dataset: {},
        });
    });

    it('no cells selected - clear all', () => {
        const table = createTable(2);
        const unselectedCell = createTableCell();
        unselectedCell.isSelected = false;
        table.rows.forEach(row => {
            row.cells.push(unselectedCell, unselectedCell), (row.height = 200);
        });

        clearSelectedCells(table, { firstRow: 0, lastRow: 1, firstColumn: 0, lastColumn: 1 });
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell],
                },
            ],
            widths: [],
            dataset: {},
        });
    });

    it('all cells selected - clear all', () => {
        const table = createTable(4);
        const selectedCell = createTableCell();
        selectedCell.isSelected = true;
        table.rows.forEach(row => {
            row.cells.push(selectedCell, selectedCell, selectedCell, selectedCell),
                (row.height = 200);
        });

        const unselectedCell = { ...selectedCell, isSelected: false };

        clearSelectedCells(table, { firstRow: 0, lastRow: 3, firstColumn: 0, lastColumn: 3 });
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell, unselectedCell],
                },
            ],
            widths: [],
            dataset: {},
        });
    });

    it('all cells selected - clear centre', () => {
        const table = createTable(4);
        const selectedCell = createTableCell();
        selectedCell.isSelected = true;
        table.rows.forEach(row => {
            row.cells.push(selectedCell, selectedCell, selectedCell, selectedCell),
                (row.height = 200);
        });

        const unselectedCell = { ...selectedCell, isSelected: false };

        clearSelectedCells(table, { firstRow: 1, lastRow: 2, firstColumn: 1, lastColumn: 2 });
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, selectedCell, selectedCell, selectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, unselectedCell, unselectedCell, selectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, unselectedCell, unselectedCell, selectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [selectedCell, selectedCell, selectedCell, selectedCell],
                },
            ],
            widths: [],
            dataset: {},
        });
    });

    it('clear selection marker', () => {
        const table = createTable(3);
        const unselectedCell = createTableCell();
        unselectedCell.isSelected = false;
        table.rows.forEach(row => {
            row.cells.push({ ...unselectedCell }, { ...unselectedCell }, { ...unselectedCell }),
                (row.height = 200);
        });

        table.rows[1].cells[1].blocks = [
            {
                blockType: 'Paragraph',
                format: {},
                segments: [
                    createSelectionMarker(),
                    { segmentType: 'Text', format: {}, text: 'Text' },
                ],
            },
        ];

        const centreWithoutMarker = createTableCell();
        centreWithoutMarker.isSelected = false;
        centreWithoutMarker.blocks = [
            {
                blockType: 'Paragraph',
                format: {},
                segments: [{ segmentType: 'Text', format: {}, text: 'Text' }],
            },
        ];

        clearSelectedCells(table, { firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 });
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, centreWithoutMarker, unselectedCell],
                },
                {
                    format: {},
                    height: 200,
                    cells: [unselectedCell, unselectedCell, unselectedCell],
                },
            ],
            widths: [],
            dataset: {},
        });
    });
});
