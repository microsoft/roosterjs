import {
    createParagraph,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';
import { shiftCells } from '../../../lib/modelApi/table/shiftCells';

describe('shiftCells - shiftCellsLeft', () => {
    it('no selection', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(createTableCell(), createTableCell());

        shiftCells(table, 'shiftCellsLeft');

        // No changes when no selection
        expect(table.rows[0].cells[0].blocks).toEqual(cell1.blocks);
        expect(table.rows[0].cells[1].blocks).toEqual(cell2.blocks);
    });

    it('shift single cell left', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Cell1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Cell2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Cell3'));
        cell3.blocks.push(para3);

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1, cell2, cell3);
        table.rows[1].cells.push(createTableCell(), createTableCell(), createTableCell());

        shiftCells(table, 'shiftCellsLeft');

        // Cell1 should now have Cell2's content, Cell2 should have Cell3's content, Cell3 should be empty
        expect(table.rows[0].cells[0].blocks).toEqual([para2]);
        expect(table.rows[0].cells[1].blocks).toEqual([para3]);
        expect(table.rows[0].cells[2].blocks).toEqual([]);
    });

    it('shift multiple cells left in single row', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Cell1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Cell2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Cell3'));
        cell3.blocks.push(para3);

        const para4 = createParagraph();
        para4.segments.push(createText('Cell4'));
        cell4.blocks.push(para4);

        cell1.isSelected = true;
        cell2.isSelected = true;

        table.rows[0].cells.push(cell1, cell2, cell3, cell4);

        shiftCells(table, 'shiftCellsLeft');

        // Selection spans 2 cells, so shift by 2
        expect(table.rows[0].cells[0].blocks).toEqual([para3]);
        expect(table.rows[0].cells[1].blocks).toEqual([para4]);
        expect(table.rows[0].cells[2].blocks).toEqual([]);
        expect(table.rows[0].cells[3].blocks).toEqual([]);
    });

    it('shift cells left across multiple rows', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1Cell1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row1Cell2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row2Cell1'));
        cell3.blocks.push(para3);

        const para4 = createParagraph();
        para4.segments.push(createText('Row2Cell2'));
        cell4.blocks.push(para4);

        cell1.isSelected = true;
        cell3.isSelected = true;

        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        shiftCells(table, 'shiftCellsLeft');

        // Both rows should shift left
        expect(table.rows[0].cells[0].blocks).toEqual([para2]);
        expect(table.rows[0].cells[1].blocks).toEqual([]);
        expect(table.rows[1].cells[0].blocks).toEqual([para4]);
        expect(table.rows[1].cells[1].blocks).toEqual([]);
    });

    it('shift cells left when selection is at the end of row', () => {
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Cell1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Cell2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Cell3'));
        cell3.blocks.push(para3);

        cell3.isSelected = true;

        table.rows[0].cells.push(cell1, cell2, cell3);

        shiftCells(table, 'shiftCellsLeft');

        // Only the last cell is selected, no cell to shift from
        expect(table.rows[0].cells[0].blocks).toEqual([para1]);
        expect(table.rows[0].cells[1].blocks).toEqual([para2]);
        expect(table.rows[0].cells[2].blocks).toEqual([]);
    });
});

describe('shiftCells - shiftCellsUp', () => {
    it('no selection', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(createTableCell(), createTableCell());

        shiftCells(table, 'shiftCellsUp');

        // No changes when no selection
        expect(table.rows[0].cells[0].blocks).toEqual(cell1.blocks);
        expect(table.rows[0].cells[1].blocks).toEqual(cell2.blocks);
    });

    it('shift single cell up', () => {
        const table = createTable(3);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row3'));
        cell3.blocks.push(para3);

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);
        table.rows[2].cells.push(cell3);

        shiftCells(table, 'shiftCellsUp');

        // Cell1 should now have Cell2's content, Cell2 should have Cell3's content, Cell3 should be empty
        expect(table.rows[0].cells[0].blocks).toEqual([para2]);
        expect(table.rows[1].cells[0].blocks).toEqual([para3]);
        expect(table.rows[2].cells[0].blocks).toEqual([]);
    });

    it('shift multiple cells up in single column', () => {
        const table = createTable(4);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row3'));
        cell3.blocks.push(para3);

        const para4 = createParagraph();
        para4.segments.push(createText('Row4'));
        cell4.blocks.push(para4);

        cell1.isSelected = true;
        cell2.isSelected = true;

        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);
        table.rows[2].cells.push(cell3);
        table.rows[3].cells.push(cell4);

        shiftCells(table, 'shiftCellsUp');

        // Selection spans 2 rows, so shift by 2
        expect(table.rows[0].cells[0].blocks).toEqual([para3]);
        expect(table.rows[1].cells[0].blocks).toEqual([para4]);
        expect(table.rows[2].cells[0].blocks).toEqual([]);
        expect(table.rows[3].cells[0].blocks).toEqual([]);
    });

    it('shift cells up across multiple columns', () => {
        const table = createTable(2);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1Col1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row1Col2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row2Col1'));
        cell3.blocks.push(para3);

        const para4 = createParagraph();
        para4.segments.push(createText('Row2Col2'));
        cell4.blocks.push(para4);

        cell1.isSelected = true;
        cell2.isSelected = true;

        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        shiftCells(table, 'shiftCellsUp');

        // Both columns should shift up
        expect(table.rows[0].cells[0].blocks).toEqual([para3]);
        expect(table.rows[0].cells[1].blocks).toEqual([para4]);
        expect(table.rows[1].cells[0].blocks).toEqual([]);
        expect(table.rows[1].cells[1].blocks).toEqual([]);
    });

    it('shift cells up when selection is at the bottom of column', () => {
        const table = createTable(3);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row3'));
        cell3.blocks.push(para3);

        cell3.isSelected = true;

        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);
        table.rows[2].cells.push(cell3);

        shiftCells(table, 'shiftCellsUp');

        // Only the last row is selected, no cell to shift from
        expect(table.rows[0].cells[0].blocks).toEqual([para1]);
        expect(table.rows[1].cells[0].blocks).toEqual([para2]);
        expect(table.rows[2].cells[0].blocks).toEqual([]);
    });

    it('shift cells up in middle of table', () => {
        const table = createTable(4);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();

        const para1 = createParagraph();
        para1.segments.push(createText('Row1'));
        cell1.blocks.push(para1);

        const para2 = createParagraph();
        para2.segments.push(createText('Row2'));
        cell2.blocks.push(para2);

        const para3 = createParagraph();
        para3.segments.push(createText('Row3'));
        cell3.blocks.push(para3);

        const para4 = createParagraph();
        para4.segments.push(createText('Row4'));
        cell4.blocks.push(para4);

        cell2.isSelected = true;

        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);
        table.rows[2].cells.push(cell3);
        table.rows[3].cells.push(cell4);

        shiftCells(table, 'shiftCellsUp');

        // Middle cell selected, shift content from below
        expect(table.rows[0].cells[0].blocks).toEqual([para1]);
        expect(table.rows[1].cells[0].blocks).toEqual([para3]);
        expect(table.rows[2].cells[0].blocks).toEqual([para4]);
        expect(table.rows[3].cells[0].blocks).toEqual([]);
    });
});

describe('shiftCells - 3x3 table scenarios', () => {
    function createTableWithContent(): {
        table: ReturnType<typeof createTable>;
        paragraphs: ReturnType<typeof createParagraph>[];
    } {
        const table = createTable(3);
        const paragraphs: ReturnType<typeof createParagraph>[] = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = createTableCell();
                const para = createParagraph();
                para.segments.push(createText(`R${i}C${j}`));
                cell.blocks.push(para);
                table.rows[i].cells.push(cell);
                paragraphs.push(para);
            }
        }

        return { table, paragraphs };
    }

    it('shift center cell left', () => {
        const { table, paragraphs } = createTableWithContent();
        table.rows[1].cells[1].isSelected = true;

        shiftCells(table, 'shiftCellsLeft');

        // Row 1: R1C0 unchanged, R1C1 gets R1C2, R1C2 becomes empty
        expect(table.rows[1].cells[0].blocks).toEqual([paragraphs[3]]); // R1C0
        expect(table.rows[1].cells[1].blocks).toEqual([paragraphs[5]]); // R1C2
        expect(table.rows[1].cells[2].blocks).toEqual([]);
    });

    it('shift center cell up', () => {
        const { table, paragraphs } = createTableWithContent();
        table.rows[1].cells[1].isSelected = true;

        shiftCells(table, 'shiftCellsUp');

        // Column 1: R0C1 unchanged, R1C1 gets R2C1, R2C1 becomes empty
        expect(table.rows[0].cells[1].blocks).toEqual([paragraphs[1]]); // R0C1
        expect(table.rows[1].cells[1].blocks).toEqual([paragraphs[7]]); // R2C1
        expect(table.rows[2].cells[1].blocks).toEqual([]);
    });

    it('shift 2x2 selection left', () => {
        const { table, paragraphs } = createTableWithContent();
        table.rows[0].cells[0].isSelected = true;
        table.rows[0].cells[1].isSelected = true;
        table.rows[1].cells[0].isSelected = true;
        table.rows[1].cells[1].isSelected = true;

        shiftCells(table, 'shiftCellsLeft');

        // Selection is 2 columns wide, shift by 2
        // Row 0: R0C0 gets R0C2, R0C1 empty, R0C2 empty
        // Row 1: R1C0 gets R1C2, R1C1 empty, R1C2 empty
        expect(table.rows[0].cells[0].blocks).toEqual([paragraphs[2]]); // R0C2
        expect(table.rows[0].cells[1].blocks).toEqual([]);
        expect(table.rows[0].cells[2].blocks).toEqual([]);
        expect(table.rows[1].cells[0].blocks).toEqual([paragraphs[5]]); // R1C2
        expect(table.rows[1].cells[1].blocks).toEqual([]);
        expect(table.rows[1].cells[2].blocks).toEqual([]);
    });

    it('shift 2x2 selection up', () => {
        const { table, paragraphs } = createTableWithContent();
        table.rows[0].cells[0].isSelected = true;
        table.rows[0].cells[1].isSelected = true;
        table.rows[1].cells[0].isSelected = true;
        table.rows[1].cells[1].isSelected = true;

        shiftCells(table, 'shiftCellsUp');

        // Selection is 2 rows tall, shift by 2
        // Col 0: R0C0 gets R2C0, R1C0 empty, R2C0 empty
        // Col 1: R0C1 gets R2C1, R1C1 empty, R2C1 empty
        expect(table.rows[0].cells[0].blocks).toEqual([paragraphs[6]]); // R2C0
        expect(table.rows[0].cells[1].blocks).toEqual([paragraphs[7]]); // R2C1
        expect(table.rows[1].cells[0].blocks).toEqual([]);
        expect(table.rows[1].cells[1].blocks).toEqual([]);
        expect(table.rows[2].cells[0].blocks).toEqual([]);
        expect(table.rows[2].cells[1].blocks).toEqual([]);
    });
});
