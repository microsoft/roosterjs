import {
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';
import {
    ContentModelTableCellFormat,
    TableCellHorizontalAlignOperation,
    TableCellVerticalAlignOperation,
} from 'roosterjs-content-model-types';
import {
    alignTableCellHorizontally,
    alignTableCellVertically,
} from '../../../lib/modelApi/table/alignTableCell';

describe('alignTableCellHorizontally', () => {
    function runTest(
        operation: TableCellHorizontalAlignOperation,
        expectedFormat: ContentModelTableCellFormat,
        isRTL?: boolean
    ) {
        const table = createTable(2);
        table.rows[0].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
        table.rows[0].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
        table.rows[0].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
        table.rows[1].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
        table.rows[1].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
        table.rows[1].cells.push(
            createTableCell(
                1,
                1,
                false,
                isRTL
                    ? {
                          direction: 'rtl',
                      }
                    : undefined
            )
        );
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
            isRTL
                ? {
                      direction: 'rtl',
                  }
                : {},
            expectedFormat,
            expectedFormat,
        ]);
        expect(table.rows[1].cells.map(c => c.format)).toEqual([
            isRTL
                ? {
                      direction: 'rtl',
                  }
                : {},
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

    it('align to left - RTL', () => {
        runTest(
            'alignCellLeft',
            {
                direction: 'rtl',
                textAlign: 'end',
            },
            true /* isRTL */
        );
    });

    it('align to right - RTL ', () => {
        runTest(
            'alignCellRight',
            {
                direction: 'rtl',
                textAlign: 'start',
            },
            true /* isRTL */
        );
    });

    it('align to left with ListItem block', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false);
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellLeft');

        expect(cell.format.textAlign).toEqual('start');
        expect(listItem.format.textAlign).toEqual('start');
    });

    it('align to center with ListItem block', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false);
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellCenter');

        expect(cell.format.textAlign).toEqual('center');
        expect(listItem.format.textAlign).toEqual('center');
    });

    it('align to right with ListItem block', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false);
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellRight');

        expect(cell.format.textAlign).toEqual('end');
        expect(listItem.format.textAlign).toEqual('end');
    });

    it('align to left with ListItem block - RTL', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false, { direction: 'rtl' });
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellLeft');

        expect(cell.format.textAlign).toEqual('end');
        expect(listItem.format.textAlign).toEqual('end');
    });

    it('align to right with ListItem block - RTL', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false, { direction: 'rtl' });
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellRight');

        expect(cell.format.textAlign).toEqual('start');
        expect(listItem.format.textAlign).toEqual('start');
    });

    it('align with mixed Paragraph and ListItem blocks', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false);
        const paragraph = createParagraph(false, { textAlign: 'end' });
        const listItem = createListItem([createListLevel('OL')]);
        cell.blocks.push(paragraph);
        cell.blocks.push(listItem);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellCenter');

        expect(cell.format.textAlign).toEqual('center');
        expect(paragraph.format.textAlign).toBeUndefined();
        expect(listItem.format.textAlign).toEqual('center');
    });

    it('paragraph without textAlign should remain unchanged', () => {
        const table = createTable(1);
        const cell = createTableCell(1, 1, false);
        const paragraph = createParagraph();
        cell.blocks.push(paragraph);
        table.rows[0].cells.push(cell);
        cell.isSelected = true;

        alignTableCellHorizontally(table, 'alignCellCenter');

        expect(cell.format.textAlign).toEqual('center');
        expect(paragraph.format.textAlign).toBeUndefined();
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
