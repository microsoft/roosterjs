import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getLeafSiblingBlock } from '../../../lib/modelApi/block/getLeafSiblingBlock';

describe('getLeafSiblingBlock', () => {
    it('Block is not in model', () => {
        const block = createParagraph();
        const model = createContentModelDocument();
        const resultBefore = getLeafSiblingBlock([model], block, false);
        const resultAfter = getLeafSiblingBlock([model], block, true);

        expect(resultBefore).toBeNull();
        expect(resultAfter).toBeNull();
    });

    it('Single block', () => {
        const block = createParagraph();
        const model = createContentModelDocument();

        model.blocks.push(block);

        const resultBefore = getLeafSiblingBlock([model], block, false);
        const resultAfter = getLeafSiblingBlock([model], block, true);

        expect(resultBefore).toBeNull();
        expect(resultAfter).toBeNull();
    });

    it('3 paragraphs', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const model = createContentModelDocument();

        model.blocks.push(block1, block2, block3);

        const resultBefore = getLeafSiblingBlock([model], block2, false);
        const resultAfter = getLeafSiblingBlock([model], block2, true);

        expect(resultBefore).toEqual({
            path: [model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [model],
            block: block3,
        });
    });

    it('3 paragraphs under block group', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const quote = createQuote();
        const model = createContentModelDocument();

        quote.blocks.push(block1, block2, block3);
        model.blocks.push(quote);

        const resultBefore = getLeafSiblingBlock([quote, model], block2, false);
        const resultAfter = getLeafSiblingBlock([quote, model], block2, true);

        expect(resultBefore).toEqual({
            path: [quote, model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [quote, model],
            block: block3,
        });
    });

    it('3 paragraphs, middle one under block group', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const quote = createQuote();
        const model = createContentModelDocument();

        quote.blocks.push(block2);
        model.blocks.push(block1, quote, block3);

        const resultBefore = getLeafSiblingBlock([quote, model], block2, false);
        const resultAfter = getLeafSiblingBlock([quote, model], block2, true);

        expect(resultBefore).toEqual({
            path: [model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [model],
            block: block3,
        });
    });

    it('3 paragraphs, only middle one under root', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const quote1 = createQuote({ backgroundColor: '4' });
        const quote2 = createQuote({ backgroundColor: '5' });
        const model = createContentModelDocument();

        quote1.blocks.push(block1);
        quote2.blocks.push(block3);
        model.blocks.push(quote1, block2, quote2);

        const resultBefore = getLeafSiblingBlock([model], block2, false);
        const resultAfter = getLeafSiblingBlock([model], block2, true);

        expect(resultBefore).toEqual({
            path: [quote1, model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [quote2, model],
            block: block3,
        });
    });

    it('1 paragraphs, between empty block group', () => {
        const block = createParagraph(false, { backgroundColor: '2' });
        const quote1 = createQuote({ backgroundColor: '4' });
        const quote2 = createQuote({ backgroundColor: '5' });
        const model = createContentModelDocument();

        model.blocks.push(quote1, block, quote2);

        const resultBefore = getLeafSiblingBlock([model], block, false);
        const resultAfter = getLeafSiblingBlock([model], block, true);

        expect(resultBefore).toEqual({
            path: [model],
            block: quote1,
        });
        expect(resultAfter).toEqual({
            path: [model],
            block: quote2,
        });
    });

    it('3 paragraphs under different group', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const quote1 = createQuote({ backgroundColor: '4' });
        const quote2 = createQuote({ backgroundColor: '5' });
        const quote3 = createQuote({ backgroundColor: '6' });
        const model = createContentModelDocument();

        quote1.blocks.push(block1);
        quote2.blocks.push(block2);
        quote3.blocks.push(block3);

        model.blocks.push(quote1, quote2, quote3);

        const resultBefore = getLeafSiblingBlock([quote2, model], block2, false);
        const resultAfter = getLeafSiblingBlock([quote2, model], block2, true);

        expect(resultBefore).toEqual({
            path: [quote1, model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [quote3, model],
            block: block3,
        });
    });

    it('3 paragraphs under different deeper group', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const quote1 = createQuote({ backgroundColor: '4' });
        const quote2 = createQuote({ backgroundColor: '5' });
        const quote3 = createQuote({ backgroundColor: '6' });
        const list1 = createListItem([]);
        const list2 = createListItem([{ listType: 'OL' }]);
        const list3 = createListItem([{ listType: 'UL' }]);
        const model = createContentModelDocument();

        list1.blocks.push(block1);
        list2.blocks.push(block2);
        list3.blocks.push(block3);
        quote1.blocks.push(list1);
        quote2.blocks.push(list2);
        quote3.blocks.push(list3);
        model.blocks.push(quote1, quote2, quote3);

        const resultBefore = getLeafSiblingBlock([list2, quote2, model], block2, false);
        const resultAfter = getLeafSiblingBlock([list2, quote2, model], block2, true);

        expect(resultBefore).toEqual({
            path: [list1, quote1, model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [list3, quote3, model],
            block: block3,
        });
    });

    it('3 paragraphs under same table cell', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const cell = createTableCell();
        const table = createTable(1);
        const model = createContentModelDocument();

        cell.blocks.push(block1, block2, block3);
        table.rows.push({ cells: [cell], format: {}, height: 0 });
        model.blocks.push(table);

        const resultBefore = getLeafSiblingBlock([cell, model], block2, false);
        const resultAfter = getLeafSiblingBlock([cell, model], block2, true);

        expect(resultBefore).toEqual({
            path: [cell, model],
            block: block1,
        });
        expect(resultAfter).toEqual({
            path: [cell, model],
            block: block3,
        });
    });

    it('3 paragraphs under different table cell', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const table = createTable(1);
        const model = createContentModelDocument();

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);
        cell3.blocks.push(block3);
        table.rows.push({ cells: [cell1, cell2, cell3], format: {}, height: 0 });
        model.blocks.push(table);

        const resultBefore = getLeafSiblingBlock([cell2, model], block2, false);
        const resultAfter = getLeafSiblingBlock([cell2, model], block2, true);

        expect(resultBefore).toBeNull();
        expect(resultAfter).toBeNull();
    });

    it('3 paragraphs, first and last are under different table cell', () => {
        const block1 = createParagraph(false, { backgroundColor: '1' });
        const block2 = createParagraph(false, { backgroundColor: '2' });
        const block3 = createParagraph(false, { backgroundColor: '3' });
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const table1 = createTable(1);
        const table2 = createTable(1);
        const model = createContentModelDocument();

        cell1.blocks.push(block1);
        cell2.blocks.push(block3);
        table1.rows.push({ cells: [cell1], format: {}, height: 0 });
        table2.rows.push({ cells: [cell2], format: {}, height: 0 });
        model.blocks.push(table1, block2, table2);

        const resultBefore = getLeafSiblingBlock([model], block2, false);
        const resultAfter = getLeafSiblingBlock([model], block2, true);

        expect(resultBefore).toEqual({
            block: table1,
            path: [model],
        });
        expect(resultAfter).toEqual({
            block: table2,
            path: [model],
        });
    });

    it('Block is under general segment, has sibling segment', () => {
        const block = createParagraph();
        const general = createGeneralSegment(null!);
        const parentParagraph = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const model = createContentModelDocument();

        general.blocks.push(block);
        parentParagraph.segments.push(text1, general, text2);
        model.blocks.push(parentParagraph);

        const resultBefore = getLeafSiblingBlock([general, model], block, false);
        const resultAfter = getLeafSiblingBlock([general, model], block, true);

        expect(resultBefore).toEqual({
            block: parentParagraph,
            path: [model],
            siblingSegment: text1,
        });
        expect(resultAfter).toEqual({
            block: parentParagraph,
            path: [model],
            siblingSegment: text2,
        });
    });

    it('Block is under general segment, no sibling segment, no sibling block', () => {
        const block = createParagraph();
        const general = createGeneralSegment(null!);
        const parentParagraph = createParagraph();
        const model = createContentModelDocument();

        general.blocks.push(block);
        parentParagraph.segments.push(general);
        model.blocks.push(parentParagraph);

        const resultBefore = getLeafSiblingBlock([general, model], block, false);
        const resultAfter = getLeafSiblingBlock([general, model], block, true);

        expect(resultBefore).toEqual(null);
        expect(resultAfter).toEqual(null);
    });

    it('Block is under general segment, no sibling segment, has sibling blocks', () => {
        const block = createParagraph();
        const general = createGeneralSegment(null!);
        const parentParagraph1 = createParagraph(false, { lineHeight: '1' });
        const parentParagraph2 = createParagraph(false, { lineHeight: '2' });
        const parentParagraph3 = createParagraph(false, { lineHeight: '3' });
        const model = createContentModelDocument();

        general.blocks.push(block);
        parentParagraph2.segments.push(general);
        model.blocks.push(parentParagraph1, parentParagraph2, parentParagraph3);

        const resultBefore = getLeafSiblingBlock([general, model], block, false);
        const resultAfter = getLeafSiblingBlock([general, model], block, true);

        expect(resultBefore).toEqual({
            block: parentParagraph1,
            path: [model],
        });
        expect(resultAfter).toEqual({
            block: parentParagraph3,
            path: [model],
        });
    });
});
