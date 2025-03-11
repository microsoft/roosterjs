import { ContentModelDocument } from 'roosterjs-content-model-types';
import { convertContentModelToMarkdown } from '../../lib/modelToMarkdown/convertContentModelToMarkdown';
import {
    createContentModelDocument,
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('convertContentModelToMarkdown', () => {
    function runTest(model: ContentModelDocument, expectedMarkdown: string) {
        // Act
        const result = convertContentModelToMarkdown(model);

        // Assert
        expect(result).toEqual(expectedMarkdown);
    }

    it('should return list, table, blockquote and paragraph', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('Heading ');
        paragraph.segments.push(text);
        const linkText = createText('link');
        linkText.link = {
            dataset: {},
            format: {
                href: 'https://example.com',
                underline: true,
            },
        };
        paragraph.segments.push(linkText);
        paragraph.decorator = {
            tagName: 'h1',
            format: {},
        };
        model.blocks.push(paragraph);

        const table = createTable(0);
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const paragraph1 = createParagraph();
        const text1 = createText('text1');
        paragraph1.segments.push(text1);
        cell1.blocks.push(paragraph1);
        row1.cells.push(cell1);
        const cell2 = createTableCell();
        const paragraph2 = createParagraph();
        const text2 = createText('text2');
        paragraph2.segments.push(text2);
        cell2.blocks.push(paragraph2);
        row1.cells.push(cell2);
        table.rows.push(row1);

        const row2 = createTableRow();
        const cell3 = createTableCell();
        const paragraph3 = createParagraph();
        const text3 = createText('text3');
        paragraph3.segments.push(text3);
        cell3.blocks.push(paragraph3);
        row2.cells.push(cell3);
        const cell4 = createTableCell();
        const paragraph4 = createParagraph();
        const text4 = createText('text4');
        paragraph4.segments.push(text4);
        cell4.blocks.push(paragraph4);
        row2.cells.push(cell4);
        table.rows.push(row2);

        model.blocks.push(table);

        const listItem = createListItem([createListLevel('OL')]);
        const paragraph5 = createParagraph();
        const text5 = createText('list item 1');
        paragraph5.segments.push(text5);
        listItem.blocks.push(paragraph5);
        model.blocks.push(listItem);

        const blockquote = createFormatContainer('blockquote');
        const paragraph6 = createParagraph();
        const text6 = createText('text');
        paragraph6.segments.push(text6);
        blockquote.blocks.push(paragraph6);
        model.blocks.push(blockquote);

        runTest(
            model,
            `# Heading [link](https://example.com)

|text1|text2|
|----|----|
|text3|text4|

1. list item 1

> text

`
        );
    });
});
