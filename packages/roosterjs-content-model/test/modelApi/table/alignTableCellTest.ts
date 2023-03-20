import { alignTableCell } from '../../../lib/modelApi/table/alignTableCell';
import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { TableOperation } from 'roosterjs-editor-types';

describe('alignTableCell', () => {
    function runTest(
        operation:
            | TableOperation.AlignCellCenter
            | TableOperation.AlignCellLeft
            | TableOperation.AlignCellRight
            | TableOperation.AlignCellTop
            | TableOperation.AlignCellMiddle
            | TableOperation.AlignCellBottom,
        expectedFormat: ContentModelTableCellFormat
    ) {
        const table = createTable(2);
        table.cells[0].push(createTableCell(1, 1, false));
        table.cells[0].push(createTableCell(1, 1, false));
        table.cells[0].push(createTableCell(1, 1, false));
        table.cells[1].push(createTableCell(1, 1, false));
        table.cells[1].push(createTableCell(1, 1, false));
        table.cells[1].push(createTableCell(1, 1, false));
        table.cells[0][1].isSelected = true;
        table.cells[0][2].isSelected = true;
        table.cells[1][1].isSelected = true;
        table.cells[1][2].isSelected = true;

        table.cells[0][0].cachedElement = {} as any;
        table.cells[0][1].cachedElement = {} as any;
        table.cells[0][2].cachedElement = {} as any;
        table.cells[1][0].cachedElement = {} as any;
        table.cells[1][1].cachedElement = {} as any;
        table.cells[1][2].cachedElement = {} as any;

        alignTableCell(table, operation);

        expect(table.cells[0].map(c => c.format)).toEqual([{}, expectedFormat, expectedFormat]);
        expect(table.cells[1].map(c => c.format)).toEqual([{}, expectedFormat, expectedFormat]);
        expect(table.cells[0][0].cachedElement).toEqual({} as any);
        expect(table.cells[0][1].cachedElement).toBeUndefined();
        expect(table.cells[0][2].cachedElement).toBeUndefined();
        expect(table.cells[1][0].cachedElement).toEqual({} as any);
        expect(table.cells[1][1].cachedElement).toBeUndefined();
        expect(table.cells[1][2].cachedElement).toBeUndefined();
    }

    it('empty table', () => {
        const table = createTable(0);

        alignTableCell(table, TableOperation.AlignCellLeft);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [],
            widths: [],
            heights: [],
            dataset: {},
        });
    });

    it('align to left', () => {
        runTest(TableOperation.AlignCellLeft, {
            textAlign: 'start',
            verticalAlign: undefined,
        });
    });

    it('align to center', () => {
        runTest(TableOperation.AlignCellCenter, {
            textAlign: 'center',
            verticalAlign: undefined,
        });
    });

    it('align to right', () => {
        runTest(TableOperation.AlignCellRight, {
            textAlign: 'end',
            verticalAlign: undefined,
        });
    });

    it('align to top', () => {
        runTest(TableOperation.AlignCellTop, {
            textAlign: undefined,
            verticalAlign: 'top',
        });
    });

    it('align to middle', () => {
        runTest(TableOperation.AlignCellMiddle, {
            textAlign: undefined,
            verticalAlign: 'middle',
        });
    });

    it('align to bottom', () => {
        runTest(TableOperation.AlignCellBottom, {
            textAlign: undefined,
            verticalAlign: 'bottom',
        });
    });
});
