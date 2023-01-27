import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { setModelIndentation } from '../../../lib/modelApi/block/setModelIndentation';

describe('indent', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = setModelIndentation(group, 'indent');

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

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
        expect(result).toBeFalse();
    });

    it('Group with selected paragraph', () => {
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

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { marginLeft: '20px' });
        const para2 = createParagraph(false, { marginLeft: '40px' });
        const para3 = createParagraph(false, { marginLeft: '60px' });
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
        text2.isSelected = true;
        text3.isSelected = true;

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '80px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '80px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected indented paragraph in RTL', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginLeft: '20px',
            marginRight: '80px',
            direction: 'rtl',
        });
        const text1 = createText('test1');

        para1.segments.push(text1);
        group.blocks.push(para1);

        text1.isSelected = true;

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '20px',
                        marginRight: '120px',
                        direction: 'rtl',
                    },
                    segments: [text1],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph - 1', () => {
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
        text3.isSelected = true;

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph - 2', () => {
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

        text1.isSelected = true;
        text3.isSelected = true;

        const result = setModelIndentation(group, 'indent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph under OL', () => {
        const group = createContentModelDocument();
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

        const result = setModelIndentation(group, 'indent');

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
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph under OL with formats', () => {
        const group = createContentModelDocument();
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

        const result = setModelIndentation(group, 'indent');

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
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph and multiple OL', () => {
        const group = createContentModelDocument();
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

        const result = setModelIndentation(group, 'indent');

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
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph and multiple OL', () => {
        const group = createContentModelDocument();
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

        const result = setModelIndentation(group, 'indent');

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
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph and UL and OL', () => {
        const group = createContentModelDocument();
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

        const result = setModelIndentation(group, 'indent');

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
        });
        expect(result).toBeTrue();
    });

    it('Mixed with paragraph, list item and quote', () => {
        const group = createContentModelDocument();

        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test2');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'UL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);

        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(para3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = setModelIndentation(group, 'indent');

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
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected indented paragraph, outdent with different length', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginLeft: '60px',
        });
        const text1 = createText('test1');

        para1.segments.push(text1);
        group.blocks.push(para1);

        text1.isSelected = true;

        const result = setModelIndentation(group, 'indent', 15);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '75px',
                    },
                    segments: [text1],
                },
            ],
        });
        expect(result).toBeTrue();
    });
});

describe('outdent', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = setModelIndentation(group, 'outdent');

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

        const result = setModelIndentation(group, 'outdent');
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

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para1, para2, para3],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected single indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginLeft: '40px',
        });
        const para2 = createParagraph(false, {
            marginLeft: '40px',
        });
        const para3 = createParagraph(false, {
            marginLeft: '40px',
        });
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

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '0px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected 2 indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { marginLeft: '40px' });
        const para2 = createParagraph(false, { marginLeft: '40px' });
        const para3 = createParagraph(false, { marginLeft: '60px' });
        const para4 = createParagraph(false, { marginLeft: '40px' });
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.segments.push(text4);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);
        group.blocks.push(para4);

        text2.isSelected = true;
        text3.isSelected = true;

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '0px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text4],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected multiple indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { marginLeft: '40px' });
        const para2 = createParagraph(false, { marginLeft: '40px' });
        const para3 = createParagraph(false, { marginLeft: '81px' });
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

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '0px',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '80px',
                    },
                    segments: [text3],
                },
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

        const result = setModelIndentation(group, 'outdent');
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

        const result = setModelIndentation(group, 'outdent');
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
        const para1 = createParagraph(false, { marginLeft: '20px' });
        const para2 = createParagraph(false, { marginLeft: '40px' });
        const para3 = createParagraph(false, { marginLeft: '60px' });
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem = createListItem([{ listType: 'UL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);

        group.blocks.push(listItem);
        group.blocks.push(para2);
        group.blocks.push(para3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    ...listItem,
                    levels: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '0px',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected indented paragraph in RTL', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginLeft: '20px',
            marginRight: '80px',
            direction: 'rtl',
        });
        const text1 = createText('test1');

        para1.segments.push(text1);
        group.blocks.push(para1);

        text1.isSelected = true;

        const result = setModelIndentation(group, 'outdent');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '20px',
                        marginRight: '40px',
                        direction: 'rtl',
                    },
                    segments: [text1],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected indented paragraph, outdent with different length', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginLeft: '60px',
        });
        const text1 = createText('test1');

        para1.segments.push(text1);
        group.blocks.push(para1);

        text1.isSelected = true;

        const result = setModelIndentation(group, 'outdent', 15);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '45px',
                    },
                    segments: [text1],
                },
            ],
        });
        expect(result).toBeTrue();
    });
});
