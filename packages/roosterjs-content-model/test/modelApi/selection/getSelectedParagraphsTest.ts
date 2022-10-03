import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getSelectedParagraphs } from '../../../lib/modelApi/selection/getSelectedParagraphs';

describe('getSelectedParagraphs', () => {
    it('empty group', () => {
        const group = createContentModelDocument(document);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([]);
    });

    it('Group without selection', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([]);
    });

    it('Group with single selection', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
            },
        ]);
    });

    it('Group with multiple selection', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
            },
            {
                paragraph: para2,
                path: [group],
            },
        ]);
    });

    it('Group with selection inside list', () => {
        const group = createContentModelDocument(document);
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        listItem.blocks.push(para1);

        group.blocks.push(listItem);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [listItem, group],
            },
        ]);
    });

    it('Group with selection inside quote', () => {
        const group = createContentModelDocument(document);
        const quote = createQuote();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        quote.blocks.push(para1);

        group.blocks.push(quote);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [quote, group],
            },
        ]);
    });

    it('Group with selection inside table', () => {
        const group = createContentModelDocument(document);
        const table = createTable(1);
        const cell = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell.blocks.push(para1);
        table.cells = [[cell]];

        group.blocks.push(table);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [cell, group],
            },
        ]);
    });

    it('Group with selection inside table, list and quote', () => {
        const group = createContentModelDocument(document);
        const table = createTable(1);
        const cell = createTableCell();
        const quote = createQuote();
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem.blocks.push(para1);
        quote.blocks.push(listItem);
        cell.blocks.push(quote);
        table.cells = [[cell]];

        group.blocks.push(table);
        group.blocks.push(para2);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [listItem, quote, cell, group],
            },
        ]);
    });

    it('Group with table selection', () => {
        const group = createContentModelDocument(document);
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell1.blocks.push(para2);
        table.cells = [[cell1, cell2]];

        group.blocks.push(table);

        const result = getSelectedParagraphs(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [cell1, group],
            },
            {
                paragraph: para2,
                path: [cell1, group],
            },
        ]);
    });
});
