import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createText } from '../../../lib/modelApi/creators/createText';
import { outdent } from '../../../lib/modelApi/block/outdent';

describe('outdent', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = outdent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(result).toBeFalse();
    });

    it('Group without selection', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        group.blocks.push(para);

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
        expect(result).toBeFalse();
    });

    it('Group with selected paragraph that cannot outdent', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        text2.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para1, para2, para3],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected single indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        quote.blocks.push(para1);
        quote.blocks.push(para2);
        quote.blocks.push(para3);
        group.blocks.push(quote);

        text2.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para1],
                    format: {},
                },
                para2,
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para3],
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected 2 indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const para4 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.segments.push(text4);
        quote.blocks.push(para1);
        quote.blocks.push(para2);
        quote.blocks.push(para3);
        quote.blocks.push(para4);
        group.blocks.push(quote);

        text2.isSelected = true;
        text3.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para1],
                    format: {},
                },
                para2,
                para3,
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para4],
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected multiple indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        quote.blocks.push(para1);
        quote.blocks.push(para2);
        quote.blocks.push(para3);
        group.blocks.push(quote);

        text1.isSelected = true;
        text3.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                para1,
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para2],
                    format: {},
                },
                para3,
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected list item', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const listItem = createListItem([{ listType: 'OL' }]);

        para1.segments.push(text1);
        listItem.blocks.push(para1);
        group.blocks.push(listItem);

        text1.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    ...listItem,
                    levels: [],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected multiple level list item', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const listItem = createListItem([
            { listType: 'OL', startNumberOverride: 1, orderedStyleType: 2, unorderedStyleType: 3 },
            { listType: 'UL' },
        ]);

        para1.segments.push(text1);
        listItem.blocks.push(para1);
        group.blocks.push(listItem);

        text1.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    ...listItem,
                    levels: [
                        {
                            listType: 'OL',
                            startNumberOverride: 1,
                            orderedStyleType: 2,
                            unorderedStyleType: 3,
                        },
                    ],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with mixed list item, quote and paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test1');
        const text3 = createText('test1');
        const listItem = createListItem([{ listType: 'UL' }]);
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        quote.blocks.push(para2);

        group.blocks.push(listItem);
        group.blocks.push(quote);
        group.blocks.push(para3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = outdent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    ...listItem,
                    levels: [],
                },
                para2,
                para3,
            ],
        });
        expect(result).toBeTrue();
    });
});
