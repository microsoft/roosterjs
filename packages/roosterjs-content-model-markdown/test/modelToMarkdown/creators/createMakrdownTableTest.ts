import { ContentModelTable } from 'roosterjs-content-model-types';
import { createMarkdownTable } from '../../../lib/modelToMarkdown/creators/createMarkdownTable';
import {
    createParagraph,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('createMarkdownTable', () => {
    function runTest(table: ContentModelTable, expected: string) {
        const result = createMarkdownTable(table, {
            listItemCount: 0,
            subListItemCount: 0,
        });
        expect(result).toBe(expected);
    }

    it('should return table with two rows and one column', () => {
        const table = createTable(0, {
            borderCollapse: true,
        });
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText('text1');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        cell1.format.textAlign = 'start';
        cell1.isHeader = true;
        row1.cells.push(cell1);

        table.rows.push(row1);

        const row2 = createTableRow();
        const cell2 = createTableCell();
        const paragraph2 = createParagraph();
        const text2 = createText('text2');
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        cell2.format.textAlign = 'start';
        row2.cells.push(cell2);

        table.rows.push(row2);

        runTest(table, '|text1|\n|----|\n|text2|\n');
    });

    it('should return table with two rows and two columns', () => {
        const table = createTable(0, {
            borderCollapse: true,
        });
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText('text1');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        cell1.format.textAlign = 'start';
        cell1.isHeader = true;
        row1.cells.push(cell1);

        const cell2 = createTableCell();
        const paragraph2 = createParagraph();
        const text2 = createText('text2');
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        cell2.format.textAlign = 'start';
        cell2.isHeader = true;
        row1.cells.push(cell2);

        table.rows.push(row1);

        const row2 = createTableRow();
        const cell3 = createTableCell();
        const paragraph3 = createParagraph();
        const text3 = createText('text3');
        paragraph3.segments.push(text3);
        cell3.blocks.push(paragraph3);
        cell3.format.textAlign = 'start';
        row2.cells.push(cell3);

        const cell4 = createTableCell();
        const paragraph4 = createParagraph();
        const text4 = createText('text4');
        paragraph4.segments.push(text4);
        cell4.blocks.push(paragraph4);
        cell4.format.textAlign = 'start';
        row2.cells.push(cell4);

        table.rows.push(row2);
        runTest(table, '|text1|text2|\n|----|----|\n|text3|text4|\n');
    });

    it('should return table with two rows and two columns with alignment', () => {
        const table = createTable(0, {
            borderCollapse: true,
        });
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText('text1');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        cell1.format.textAlign = 'start';
        cell1.isHeader = true;
        row1.cells.push(cell1);

        const cell2 = createTableCell();
        const paragraph2 = createParagraph();
        const text2 = createText('text2');
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        cell2.format.textAlign = 'end';
        cell2.isHeader = true;
        row1.cells.push(cell2);

        table.rows.push(row1);

        const row2 = createTableRow();
        const cell3 = createTableCell();
        const paragraph3 = createParagraph();
        const text3 = createText('text3');
        paragraph3.segments.push(text3);
        cell3.blocks.push(paragraph3);
        cell3.format.textAlign = 'start';
        row2.cells.push(cell3);

        const cell4 = createTableCell();
        const paragraph4 = createParagraph();
        const text4 = createText('text4');
        paragraph4.segments.push(text4);
        cell4.blocks.push(paragraph4);
        cell4.format.textAlign = 'end';
        row2.cells.push(cell4);

        table.rows.push(row2);
        runTest(table, '|text1|text2|\n|----|----:|\n|text3|text4|\n');
    });

    it('should return table with 2 rows and 3 columns with alignment', () => {
        const table = createTable(0, {
            borderCollapse: true,
        });
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText(' text1 ');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        cell1.format.textAlign = 'start';
        cell1.isHeader = true;
        row1.cells.push(cell1);

        const cell2 = createTableCell();
        const paragraph2 = createParagraph();
        const text2 = createText(' text2 ');
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        cell2.format.textAlign = 'end';
        cell2.isHeader = true;
        row1.cells.push(cell2);

        const cell3 = createTableCell();
        const paragraph3 = createParagraph();
        const text3 = createText(' text3 ');
        paragraph3.segments.push(text3);
        cell3.blocks.push(paragraph3);
        cell3.format.textAlign = 'center';
        cell3.isHeader = true;
        row1.cells.push(cell3);

        table.rows.push(row1);

        const row2 = createTableRow();
        const cell4 = createTableCell();
        const paragraph4 = createParagraph();
        const text4 = createText(' text4 ');
        paragraph4.segments.push(text4);
        cell4.blocks.push(paragraph4);
        cell4.format.textAlign = 'start';
        row2.cells.push(cell4);

        const cell5 = createTableCell();
        const paragraph5 = createParagraph();
        const text5 = createText(' text5 ');
        paragraph5.segments.push(text5);
        cell5.blocks.push(paragraph5);
        cell5.format.textAlign = 'end';
        row2.cells.push(cell5);

        const cell6 = createTableCell();
        const paragraph6 = createParagraph();
        const text6 = createText(' text6 ');
        paragraph6.segments.push(text6);
        cell6.blocks.push(paragraph6);
        cell6.format.textAlign = 'center';
        row2.cells.push(cell6);

        table.rows.push(row2);

        runTest(
            table,
            '| text1 | text2 | text3 |\n|----|----:|:----:|\n| text4 | text5 | text6 |\n'
        );
    });
});
