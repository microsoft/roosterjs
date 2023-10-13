import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { setListType } from '../../../lib/modelApi/list/setListType';
import {
    createBr,
    createContentModelDocument,
    createFormatContainer,
    createImage,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('indent', () => {
    let normalizeContentModelSpy: jasmine.Spy;
    beforeEach(() => {
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');
    });

    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = setListType(group, 'OL');

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

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
        expect(result).toBeFalse();
    });

    it('Group with single paragraph selection', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        group.blocks.push(para);

        text.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                textAlign: undefined,
                                marginTop: undefined,
                            },
                            dataset: {},
                        },
                    ],
                    blocks: [para],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                        isSelected: true,
                    },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: {},
            isImplicit: true,
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    isSelected: true,
                },
            ],
        });
    });

    it('Group with single list item selection in a different type', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');
        const listItem = createListItem([createListLevel('UL')]);

        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL', format: {}, dataset: {} }],
                    blocks: [para],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with single list item selection in same type', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');
        const listItem = createListItem([createListLevel('OL')]);

        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [],
                    blocks: [para],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with single list item selection in same type and then normalize', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');
        const listItem = createListItem([createListLevel('OL')]);

        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        normalizeContentModelSpy.and.callThrough();

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
        expect(result).toBeTrue();
    });

    it('Group with single list item selection in same type with implicit paragraph', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');
        const listItem = createListItem([createListLevel('OL')]);

        para.isImplicit = true;
        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [],
                    blocks: [para],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: {},
            isImplicit: false,
            segments: [
                {
                    segmentType: 'Text',
                    format: {},
                    isSelected: true,
                    text: 'test',
                },
            ],
        });
    });

    it('Group with mixed selection', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem1 = createListItem([createListLevel('OL')]);
        const listItem2 = createListItem([createListLevel('OL'), createListLevel('UL')]);
        const quote = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        quote.blocks.push(para3);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);
        group.blocks.push(quote);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL', dataset: {}, format: {} }],
                    blocks: [para1],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                    format: {},
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        { listType: 'OL', dataset: {}, format: {} },
                        { listType: 'OL', dataset: {}, format: {} },
                    ],
                    blocks: [para2],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                    format: {},
                },
                {
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [
                        {
                            blockGroupType: 'ListItem',
                            blockType: 'BlockGroup',
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        startNumberOverride: undefined,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {},
                                },
                            ],
                            blocks: [para3],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                                isSelected: true,
                            },
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Carry over existing segment and direction format', () => {
        const group = createContentModelDocument();
        const para = createParagraph(false, {
            direction: 'rtl',
            textAlign: 'start',
            backgroundColor: 'yellow',
        });
        const text = createText('test', {
            fontFamily: 'Arial',
            fontSize: '10px',
            textColor: 'black',
            backgroundColor: 'white',
            fontWeight: 'bold',
            italic: true,
            underline: true,
        });

        para.segments.push(text);
        group.blocks.push(para);

        text.isSelected = true;

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                startNumberOverride: 1,
                                direction: 'rtl',
                                textAlign: 'start',
                                marginTop: undefined,
                            },
                        },
                    ],
                    blocks: [para],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {
                            fontFamily: 'Arial',
                            fontSize: '10px',
                            textColor: 'black',
                        },
                        isSelected: true,
                    },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: { direction: 'rtl', textAlign: 'start', backgroundColor: 'yellow' },
            isImplicit: true,
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontFamily: 'Arial',
                        fontSize: '10px',
                        textColor: 'black',
                        backgroundColor: 'white',
                        fontWeight: 'bold',
                        italic: true,
                        underline: true,
                    },
                    isSelected: true,
                },
            ],
        });
    });

    it('do not turn on list for empty paragraphs', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text = createText('test1');
        const br = createBr();
        const img = createImage('img');

        para1.segments.push(text);
        para2.segments.push(br);
        para3.segments.push(img);
        group.blocks.push(para1, para2, para3);

        text.isSelected = true;
        br.isSelected = true;
        img.isSelected = true;

        const result = setListType(group, 'OL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para1],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                textAlign: undefined,
                                marginTop: undefined,
                                marginBottom: '0',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
                para2,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para3],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                direction: undefined,
                                textAlign: undefined,
                                startNumberOverride: undefined,
                                marginTop: '0',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
            ],
        });
    });

    it('still turn on list for empty paragraphs if it is the only selected paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text = createText('test1');
        const br = createBr();
        const img = createImage('img');

        para1.segments.push(text);
        para2.segments.push(br);
        para3.segments.push(img);
        group.blocks.push(para1, para2, para3);

        br.isSelected = true;

        const result = setListType(group, 'OL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                para1,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para2],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                textAlign: undefined,
                                marginTop: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
                para3,
            ],
        });
    });

    it('do not turn on list for table', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const table = createTable(1);
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const cell = createTableCell();

        para1.segments.push(text1);
        para2.segments.push(text2);
        table.rows[0].cells.push(cell);
        group.blocks.push(para1, table, para2);

        text1.isSelected = true;
        text2.isSelected = true;
        cell.isSelected = true;

        const result = setListType(group, 'OL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para1],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                textAlign: undefined,
                                marginTop: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [table],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                startNumberOverride: undefined,
                                direction: undefined,
                                textAlign: undefined,
                                marginTop: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para2],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {
                                marginTop: undefined,
                                direction: undefined,
                                textAlign: undefined,
                                startNumberOverride: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
            ],
        });
    });

    it('Change style type to existing list', () => {
        const group = createContentModelDocument();
        const list1 = createListItem([createListLevel('OL')]);
        const para1 = createParagraph();
        const br = createBr();

        para1.segments.push(br);
        list1.blocks.push(para1);
        group.blocks.push(list1);

        br.isSelected = true;

        const result = setListType(group, 'UL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para1],
                    levels: [{ listType: 'UL', format: {}, dataset: {} }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
        });
    });
});
