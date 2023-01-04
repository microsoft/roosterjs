import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { getOperationalBlocks } from '../../../lib/modelApi/common/getOperationalBlocks';

describe('getOperationalBlocks', () => {
    it('empty input', () => {
        const result = getOperationalBlocks([], ['ListItem']);

        expect(result).toEqual([]);
    });

    it('selected paragraph without expect group type', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para,
                    path: [group],
                    segments: [],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            {
                paragraph: para,
                path: [group],
                segments: [],
            },
        ]);
    });

    it('selected paragraph with expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [group],
                    segments: [],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            listItem,
            {
                paragraph: para2,
                path: [group],
                segments: [],
            },
        ]);
    });

    it('selected multiple paragraphs in same expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listItem = createListItem([]);

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [listItem, group],
                    segments: [],
                },
                {
                    paragraph: para3,
                    path: [group],
                    segments: [],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            listItem,
            {
                paragraph: para3,
                path: [group],
                segments: [],
            },
        ]);
    });

    it('selected paragraph with stop type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem1 = createListItem([]);
        const listItem2 = createListItem([]);
        const quote = createQuote();

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem1, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [quote, listItem2, group],
                    segments: [],
                },
            ],
            ['ListItem'],
            ['Quote']
        );

        expect(result).toEqual([
            listItem1,
            {
                paragraph: para2,
                path: [quote, listItem2, group],
                segments: [],
            },
        ]);
    });

    it('selected paragraph with multiple group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);
        const quote = createQuote();

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [quote, group],
                    segments: [],
                },
            ],
            ['ListItem', 'Quote']
        );

        expect(result).toEqual([listItem, quote]);
    });

    it('multiple group type, width first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [quote1, listItem, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [quote2, group],
                    segments: [],
                },
            ],
            ['ListItem', 'Quote']
        );

        expect(result).toEqual([quote1, quote2]);
    });

    it('multiple group type, deep first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [quote1, listItem, group],
                    segments: [],
                },
                {
                    paragraph: para2,
                    path: [quote2, group],
                    segments: [],
                },
            ],
            ['ListItem', 'Quote'],
            undefined,
            true
        );

        expect(result).toEqual([listItem, quote2]);
    });
});
