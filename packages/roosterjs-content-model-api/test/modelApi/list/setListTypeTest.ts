import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import * as splitSelectedParagraphByBrModule from '../../../lib/modelApi/block/splitSelectedParagraphByBr';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setListType } from '../../../lib/modelApi/list/setListType';
import { setModelIndentation } from '../../../lib/modelApi/block/setModelIndentation';

import {
    createBr,
    createContentModelDocument,
    createFormatContainer,
    createImage,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('indent', () => {
    let normalizeContentModelSpy: jasmine.Spy;
    let splitSelectedParagraphByBrSpy: jasmine.Spy;

    beforeEach(() => {
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');
        splitSelectedParagraphByBrSpy = spyOn(
            splitSelectedParagraphByBrModule,
            'splitSelectedParagraphByBr'
        ).and.callThrough();
    });

    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = setListType(group, 'OL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(result).toBeFalse();
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
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
                        isSelected: false,
                    },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    isSelected: true,
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('Group with single paragraph selection remove margins', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        group.blocks.push(para);

        text.isSelected = true;

        const result = setListType(group, 'OL', true /** remove margins */);

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
                                marginBottom: '0px',
                                marginTop: '0px',
                                textAlign: undefined,
                            },
                            dataset: {
                                editingInfo: '{"applyListStyleFromLevel":true}',
                            },
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
                        isSelected: false,
                    },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    isSelected: true,
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                        },
                    ],
                    blocks: [para],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                    levels: [
                        {
                            listType: 'OL',
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {},
                        },
                    ],
                    blocks: [para1],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
                    format: {},
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        { listType: 'OL', dataset: {}, format: {} },
                        {
                            listType: 'OL',
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {},
                        },
                    ],
                    blocks: [para2],
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
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
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                        textAlign: undefined,
                                    },
                                    dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
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
                                isSelected: false,
                            },
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(result).toBeTrue();
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                startNumberOverride: 1,
                                direction: 'rtl',
                                textAlign: 'start',
                                marginBottom: undefined,
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
                        isSelected: false,
                    },
                    format: {
                        textAlign: 'start',
                        direction: 'rtl',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
        expect(para).toEqual({
            blockType: 'Paragraph',
            format: { direction: 'rtl', textAlign: 'start', backgroundColor: 'yellow' },
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                                marginBottom: '0px',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                                startNumberOverride: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                startNumberOverride: undefined,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                            format: {
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                                startNumberOverride: undefined,
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
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
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
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
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                        },
                    ],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: false, format: {} },
                    format: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('turn on list on indented paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        para1.segments.push(marker, createText('test1'));
        para2.segments.push(createText('test1'), marker);
        group.blocks.push(para1, para2);
        setModelIndentation(group, 'indent');
        setListType(group, 'UL');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para1],
                    levels: [
                        {
                            listType: 'UL',
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para2],
                    levels: [
                        {
                            listType: 'UL',
                            format: {
                                startNumberOverride: undefined,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(2);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('turn off list on indented paragraph', () => {
        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
            format: {},
        };
        normalizeContentModelSpy.and.callThrough();
        setListType(group, 'UL');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        marginLeft: '40px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
            format: {},
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('turn on list on indented segment', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        para1.segments.push(marker, createText('test1'));
        group.blocks.push(para1);
        setModelIndentation(group, 'indent');
        setListType(group, 'UL');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [para1],
                    levels: [
                        {
                            listType: 'UL',
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                                textAlign: undefined,
                            },
                            dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(2);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('turn on list for empty paragraph inside table cell', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const br = createBr();

        br.isSelected = true;
        para.segments.push(br);
        cell.blocks.push(para);
        table.rows[0].cells.push(cell);
        group.blocks.push(table);

        const result = setListType(group, 'OL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'BlockGroup',
                                            blockGroupType: 'ListItem',
                                            blocks: [para],
                                            levels: [
                                                {
                                                    listType: 'OL',
                                                    format: {
                                                        startNumberOverride: undefined,
                                                        direction: undefined,
                                                        marginBottom: undefined,
                                                        marginTop: undefined,
                                                        textAlign: undefined,
                                                    },
                                                    dataset: {
                                                        editingInfo:
                                                            '{"applyListStyleFromLevel":true}',
                                                    },
                                                },
                                            ],
                                            formatHolder: {
                                                segmentType: 'SelectionMarker',
                                                isSelected: false,
                                                format: {
                                                    fontFamily: undefined,
                                                    fontSize: undefined,
                                                    textColor: undefined,
                                                },
                                            },
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });

    it('turn on list for multiple empty paragraphs inside table cells', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const br1 = createBr();
        const br2 = createBr();

        br1.isSelected = true;
        br2.isSelected = true;
        para1.segments.push(br1);
        para2.segments.push(br2);
        cell1.blocks.push(para1);
        cell2.blocks.push(para2);
        table.rows[0].cells.push(cell1, cell2);
        group.blocks.push(table);

        const result = setListType(group, 'OL');

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'BlockGroup',
                                            blockGroupType: 'ListItem',
                                            blocks: [para1],
                                            levels: [
                                                {
                                                    listType: 'OL',
                                                    format: {
                                                        startNumberOverride: undefined,
                                                        direction: undefined,
                                                        marginBottom: undefined,
                                                        marginTop: undefined,
                                                        textAlign: undefined,
                                                    },
                                                    dataset: {
                                                        editingInfo:
                                                            '{"applyListStyleFromLevel":true}',
                                                    },
                                                },
                                            ],
                                            formatHolder: {
                                                segmentType: 'SelectionMarker',
                                                isSelected: false,
                                                format: {
                                                    fontFamily: undefined,
                                                    fontSize: undefined,
                                                    textColor: undefined,
                                                },
                                            },
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'BlockGroup',
                                            blockGroupType: 'ListItem',
                                            blocks: [para2],
                                            levels: [
                                                {
                                                    listType: 'OL',
                                                    format: {
                                                        startNumberOverride: undefined,
                                                        direction: undefined,
                                                        marginBottom: undefined,
                                                        marginTop: undefined,
                                                        textAlign: undefined,
                                                    },
                                                    dataset: {
                                                        editingInfo:
                                                            '{"applyListStyleFromLevel":true}',
                                                    },
                                                },
                                            ],
                                            formatHolder: {
                                                segmentType: 'SelectionMarker',
                                                isSelected: false,
                                                format: {
                                                    fontFamily: undefined,
                                                    fontSize: undefined,
                                                    textColor: undefined,
                                                },
                                            },
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(group);
    });
});
