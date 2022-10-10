import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createText } from '../../../lib/modelApi/creators/createText';
import { indent } from '../../../lib/modelApi/block/indent';

describe('indent', () => {
    it('Empty group', () => {
        const group = createContentModelDocument(document);

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(result).toBeFalse();
    });

    it('Group without selection', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();

        group.blocks.push(para);

        const result = indent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
            document: document,
        });
        expect(result).toBeFalse();
    });

    it('Group with selected paragraph', () => {
        const group = createContentModelDocument(document);
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

        const result = indent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                para1,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para2],
                    format: {},
                },
                para3,
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph - 1', () => {
        const group = createContentModelDocument(document);
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
        text3.isSelected = true;

        const result = indent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                para1,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para2, para3],
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph - 2', () => {
        const group = createContentModelDocument(document);
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

        text1.isSelected = true;
        text3.isSelected = true;

        const result = indent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para1],
                    format: {},
                },
                para2,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para3],
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph - 3', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const para4 = createParagraph();
        const para5 = createParagraph();
        const para6 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');
        const text6 = createText('test6');
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.segments.push(text4);
        para5.segments.push(text5);
        para6.segments.push(text6);
        quote.blocks.push(para3);
        quote.blocks.push(para4);

        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(quote);
        group.blocks.push(para5);
        group.blocks.push(para6);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text5.isSelected = true;

        const result = indent(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para1, para2],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'Quote',
                            blocks: [para3],
                            format: {},
                        },
                        para4,
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [para5],
                    format: {},
                },
                para6,
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph under OL', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem = createListItem([{ listType: 'OL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);

        text2.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para1, para2, para3],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph under OL with formats', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem = createListItem([
            { listType: 'OL', startNumberOverride: 2, orderedStyleType: 3, unorderedStyleType: 4 },
        ]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);

        text2.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                            startNumberOverride: 2,
                            orderedStyleType: 3,
                            unorderedStyleType: 4,
                        },
                        { listType: 'OL' },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph and multiple OL', () => {
        const group = createContentModelDocument(document);
        const para2 = createParagraph();
        const text2 = createText('test2');
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const listItem3 = createListItem([{ listType: 'OL' }]);

        para2.segments.push(text2);
        listItem2.blocks.push(para2);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(listItem3);

        text2.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                listItem1,
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para2],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
                listItem3,
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph and multiple OL', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test2');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const listItem3 = createListItem([{ listType: 'OL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem2.blocks.push(para1);
        listItem2.blocks.push(para2);
        listItem3.blocks.push(para3);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(listItem3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                listItem1,
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para1, para2],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para3],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph and UL and OL', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test2');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const listItem3 = createListItem([{ listType: 'UL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem2.blocks.push(para1);
        listItem2.blocks.push(para2);
        listItem3.blocks.push(para3);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(listItem3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                listItem1,
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para1, para2],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'UL' }, { listType: 'UL' }],
                    blocks: [para3],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });

    it('Mixed with paragraph, list item and quote', () => {
        const group = createContentModelDocument(document);

        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const para4 = createParagraph();
        const text1 = createText('test2');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'UL' }]);
        const quote = createQuote();

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.segments.push(text4);

        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        quote.blocks.push(para4);

        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(para3);
        group.blocks.push(quote);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;

        const result = indent(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }, { listType: 'OL' }],
                    blocks: [para1],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'UL' }, { listType: 'UL' }],
                    blocks: [para2],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [para3],
                    format: {},
                },
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [
                        {
                            blockGroupType: 'Quote',
                            blockType: 'BlockGroup',
                            blocks: [para4],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            document: document,
        });
        expect(result).toBeTrue();
    });
});
