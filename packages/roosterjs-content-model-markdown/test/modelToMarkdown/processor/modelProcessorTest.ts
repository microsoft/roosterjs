import { ContentModelDocument } from 'roosterjs-content-model-types';
import { modelProcessor } from '../../../lib/modelToMarkdown/processor/modelProcessor';
import {
    createContentModelDocument,
    createFormatContainer,
    createImage,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('modelProcessor', () => {
    function runTest(model: ContentModelDocument, expectedMarkdown: string) {
        // Act
        const result = modelProcessor(model);

        // Assert
        expect(result).toEqual(expectedMarkdown);
    }

    it('should return paragraph with text', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        model.blocks.push(paragraph);
        runTest(model, 'text\n\n');
    });

    it('should return paragraph with text and image', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text ');
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        paragraph.segments.push(text);
        paragraph.segments.push(image);
        model.blocks.push(paragraph);
        runTest(model, 'text ![image of a dog](https://www.example.com/image)\n\n');
    });

    it('should return paragraph with text and link', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        paragraph.segments.push(text);
        paragraph.segments.push(link);
        model.blocks.push(paragraph);
        runTest(model, 'text [link](https://www.example.com)\n\n');
    });

    it('should return paragraph with text and bold', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text ');
        const bold = createText('bold');
        bold.format = {
            fontWeight: 'bold',
        };
        paragraph.segments.push(text);
        paragraph.segments.push(bold);
        model.blocks.push(paragraph);
        runTest(model, 'text **bold**\n\n');
    });

    it('should return paragraph with text and italic', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text ');
        const italic = createText('italic');
        italic.format = {
            italic: true,
        };
        paragraph.segments.push(text);
        paragraph.segments.push(italic);
        model.blocks.push(paragraph);
        runTest(model, 'text *italic*\n\n');
    });

    it('should return a list item', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);
        runTest(model, '1. text\n');
    });

    it('should return a list item with text and image', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text ');
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        paragraph.segments.push(text);
        paragraph.segments.push(image);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);
        runTest(model, '1. text ![image of a dog](https://www.example.com/image)\n');
    });
    it('should return a list item with text and link', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        paragraph.segments.push(text);
        paragraph.segments.push(link);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);
        runTest(model, '1. text [link](https://www.example.com)\n');
    });

    it('should return a nested list item', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);
        runTest(model, '   1. text\n');
    });

    it('should return two list items and nested list', () => {
        const model = createContentModelDocument();
        const listItem1 = createListItem([createListLevel('OL')]);
        const paragraph1 = createParagraph();
        const text1 = createText('text1');
        paragraph1.segments.push(text1);
        listItem1.blocks.push(paragraph1);
        model.blocks.push(listItem1);

        const listItem2 = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph2 = createParagraph();
        const text2 = createText('text2');
        paragraph2.segments.push(text2);
        listItem2.blocks.push(paragraph2);
        model.blocks.push(listItem2);

        runTest(model, '1. text1\n   1. text2\n');
    });

    it('should return two list items with text and image', () => {
        const model = createContentModelDocument();
        const listItem1 = createListItem([createListLevel('OL')]);
        const paragraph1 = createParagraph();
        const text1 = createText('text1 ');
        const image1 = createImage('https://www.example.com/image1');
        image1.alt = 'image of a dog';
        paragraph1.segments.push(text1);
        paragraph1.segments.push(image1);
        listItem1.blocks.push(paragraph1);
        model.blocks.push(listItem1);

        const listItem2 = createListItem([createListLevel('OL')]);
        const paragraph2 = createParagraph();
        const text2 = createText('text2 ');
        const image2 = createImage('https://www.example.com/image2');
        image2.alt = 'image of a cat';
        paragraph2.segments.push(text2);
        paragraph2.segments.push(image2);
        listItem2.blocks.push(paragraph2);
        model.blocks.push(listItem2);

        runTest(
            model,
            '1. text1 ![image of a dog](https://www.example.com/image1)\n2. text2 ![image of a cat](https://www.example.com/image2)\n'
        );
    });

    it('should return a table with two rows and two columns', () => {
        const model = createContentModelDocument();
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

        runTest(model, '|text1|text2|\n|----|----|\n|text3|text4|\n\n');
    });

    it('should return a blockquote', () => {
        const model = createContentModelDocument();
        const blockquote = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);
        model.blocks.push(blockquote);

        runTest(model, '> text\n\n');
    });

    it('should return a paragraph with text, a table, a list', () => {
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
