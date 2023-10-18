import { ContentModelTableCellFormat } from 'roosterjs-content-model-types';
import { createTable, createTableCell } from 'roosterjs-content-model-dom';
import {
    alignTableCellHorizontally,
    alignTableCellVertically,
} from '../../../lib/modelApi/table/alignTableCell';
import {
    TableCellHorizontalAlignOperation,
    TableCellVerticalAlignOperation,
} from '../../../lib/publicTypes/parameter/TableOperation';

describe('alignTableCellHorizontally', () => {
    function runTest(
        operation: TableCellHorizontalAlignOperation,
        expectedFormat: ContentModelTableCellFormat
    ) {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells[1].isSelected = true;
        table.rows[0].cells[2].isSelected = true;
        table.rows[1].cells[1].isSelected = true;
        table.rows[1].cells[2].isSelected = true;

        table.rows[0].cells[0].cachedElement = {} as any;
        table.rows[0].cells[1].cachedElement = {} as any;
        table.rows[0].cells[2].cachedElement = {} as any;
        table.rows[1].cells[0].cachedElement = {} as any;
        table.rows[1].cells[1].cachedElement = {} as any;
        table.rows[1].cells[2].cachedElement = {} as any;

        alignTableCellHorizontally(table, operation);

        expect(table.rows[0].cells.map(c => c.format)).toEqual([
            {},
            expectedFormat,
            expectedFormat,
        ]);
        expect(table.rows[1].cells.map(c => c.format)).toEqual([
            {},
            expectedFormat,
            expectedFormat,
        ]);
        expect(table.rows[0].cells[0].cachedElement).toEqual({} as any);
        expect(table.rows[0].cells[1].cachedElement).toBeUndefined();
        expect(table.rows[0].cells[2].cachedElement).toBeUndefined();
        expect(table.rows[1].cells[0].cachedElement).toEqual({} as any);
        expect(table.rows[1].cells[1].cachedElement).toBeUndefined();
        expect(table.rows[1].cells[2].cachedElement).toBeUndefined();
        table.rows[0].cells[1].blocks.forEach(block => {
            expect(block.format.textAlign).toEqual(undefined);
        });
    }

    it('empty table', () => {
        const table = createTable(0);

        alignTableCellHorizontally(table, 'alignCellLeft');

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('align to left', () => {
        runTest('alignCellLeft', {
            textAlign: 'start',
        });
    });

    it('align to center', () => {
        runTest('alignCellCenter', {
            textAlign: 'center',
        });
    });

    it('align to right', () => {
        runTest('alignCellRight', {
            textAlign: 'end',
        });
    });
});

describe('alignTableCellVertically', () => {
    function runTest(
        operation: TableCellVerticalAlignOperation,
        expectedFormat: ContentModelTableCellFormat
    ) {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[1].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells[1].isSelected = true;
        table.rows[0].cells[2].isSelected = true;
        table.rows[1].cells[1].isSelected = true;
        table.rows[1].cells[2].isSelected = true;

        table.rows[0].cells[0].cachedElement = {} as any;
        table.rows[0].cells[1].cachedElement = {} as any;
        table.rows[0].cells[2].cachedElement = {} as any;
        table.rows[1].cells[0].cachedElement = {} as any;
        table.rows[1].cells[1].cachedElement = {} as any;
        table.rows[1].cells[2].cachedElement = {} as any;

        alignTableCellVertically(table, operation);

        expect(table.rows[0].cells.map(c => c.format)).toEqual([
            {},
            expectedFormat,
            expectedFormat,
        ]);
        expect(table.rows[1].cells.map(c => c.format)).toEqual([
            {},
            expectedFormat,
            expectedFormat,
        ]);
        expect(table.rows[0].cells[0].cachedElement).toEqual({} as any);
        expect(table.rows[0].cells[1].cachedElement).toBeUndefined();
        expect(table.rows[0].cells[2].cachedElement).toBeUndefined();
        expect(table.rows[1].cells[0].cachedElement).toEqual({} as any);
        expect(table.rows[1].cells[1].cachedElement).toBeUndefined();
        expect(table.rows[1].cells[2].cachedElement).toBeUndefined();
        table.rows[0].cells[1].blocks.forEach(block => {
            expect(block.format.textAlign).toEqual(undefined);
        });
    }

    it('empty table', () => {
        const table = createTable(0);

        alignTableCellVertically(table, 'alignCellBottom');

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('align to top', () => {
        runTest('alignCellTop', {
            verticalAlign: 'top',
        });
    });

    it('align to middle', () => {
        runTest('alignCellMiddle', {
            verticalAlign: 'middle',
        });
    });

    it('align to bottom', () => {
        runTest('alignCellBottom', {
            verticalAlign: 'bottom',
        });
    });
});
