import { ContentModelBlock } from 'roosterjs-content-model-types';
import { createMarkdownBlock } from '../../../lib/modelToMarkdown/creators/createMarkdownBlock';
import {
    createDivider,
    createEntity,
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('createMarkdownBlock', () => {
    function runTest(block: ContentModelBlock, expectedResult: string) {
        const result = createMarkdownBlock(
            block,
            {
                newLine: '\n',
                lineBreak: '\n\n',
            },
            {
                listItemCount: 0,
                subListItemCount: 0,
            },
            undefined,
            {
                ignoreLineBreaks: false,
            }
        );
        expect(result).toBe(expectedResult);
    }

    it('should handle Paragraph block', () => {
        const block = createParagraph();
        const text = createText('Hello, world!');
        block.segments.push(text);
        const expected = 'Hello, world!';
        runTest(block, expected);
    });

    it('should handle BlockGroup block - blockquote', () => {
        const blockquote = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('This is a blockquote.');
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);
        const expected = '> This is a blockquote.\n\n';
        runTest(blockquote, expected);
    });

    it('should handle BlockGroup block - list', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('List item 1');
        paragraph.segments.push(text);
        listItem.blocks.push(paragraph);
        const expected = '- List item 1\n';
        runTest(listItem, expected);
    });

    it('should handle table block', () => {
        const table = createTable(0);
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText('Cell 1');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        row1.cells.push(cell1);
        table.rows.push(row1);

        const row2 = createTableRow();
        const cell2 = createTableCell();
        const text2 = createText('Cell 2');
        const paragraph2 = createParagraph();
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        row2.cells.push(cell2);
        table.rows.push(row2);

        const row3 = createTableRow();
        const cell3 = createTableCell();
        const text3 = createText('Cell 3');
        const paragraph3 = createParagraph();
        paragraph3.segments.push(text3);
        cell3.blocks.push(paragraph3);
        row3.cells.push(cell3);
        table.rows.push(row3);

        const row4 = createTableRow();
        const cell4 = createTableCell();
        const text4 = createText('Cell 4');
        const paragraph4 = createParagraph();
        paragraph4.segments.push(text4);
        cell4.blocks.push(paragraph4);
        row4.cells.push(cell4);
        table.rows.push(row4);

        const expected = '|Cell 1|\n|----|\n|Cell 2|\n|Cell 3|\n|Cell 4|\n';
        runTest(table, expected);
    });

    it('should handle divider block', () => {
        const divider = createDivider('hr');
        const expected = '---\n\n';
        runTest(divider, expected);
    });

    it('should handle empty block', () => {
        const div = document.createElement('div');
        const block = createEntity(div);
        const expected = '';
        runTest(block, expected);
    });
});
