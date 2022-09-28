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
        const group = createContentModelDocument(document);
        const para = createParagraph();

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para,
                    path: [group],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            {
                paragraph: para,
                path: [group],
            },
        ]);
    });

    it('selected paragraph with expect group type', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                },
                {
                    paragraph: para2,
                    path: [group],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            listItem,
            {
                paragraph: para2,
                path: [group],
            },
        ]);
    });

    it('selected multiple paragraphs in same expect group type', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listItem = createListItem([]);

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                },
                {
                    paragraph: para2,
                    path: [listItem, group],
                },
                {
                    paragraph: para3,
                    path: [group],
                },
            ],
            ['ListItem']
        );

        expect(result).toEqual([
            listItem,
            {
                paragraph: para3,
                path: [group],
            },
        ]);
    });

    it('selected paragraph with stop type', () => {
        const group = createContentModelDocument(document);
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
                },
                {
                    paragraph: para2,
                    path: [quote, listItem2, group],
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
            },
        ]);
    });

    it('selected paragraph with multiple group type', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);
        const quote = createQuote();

        const result = getOperationalBlocks(
            [
                {
                    paragraph: para1,
                    path: [listItem, group],
                },
                {
                    paragraph: para2,
                    path: [quote, group],
                },
            ],
            ['ListItem', 'Quote']
        );

        expect(result).toEqual([listItem, quote]);
    });
});
