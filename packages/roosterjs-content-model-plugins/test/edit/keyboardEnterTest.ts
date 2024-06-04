import { keyboardEnter } from '../../lib/edit/keyboardEnter';
import {
    createBr,
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

describe('keyboardEnter', () => {
    let getDOMSelectionSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let preventDefaultSpy: jasmine.Spy;
    let editor: IEditor;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue({
            type: 'range',
        });
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        editor = {
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: formatContentModelSpy,
        } as any;
    });

    function runTest(
        input: ContentModelDocument,
        shift: boolean,
        output: ContentModelDocument,
        isChanged: boolean,
        pendingFormat: ContentModelSegmentFormat | undefined
    ) {
        const rawEvent: KeyboardEvent = {
            key: 'Enter',
            shiftKey: shift,
            preventDefault: preventDefaultSpy,
        } as any;
        const context: FormatContentModelContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            rawEvent,
        };
        formatContentModelSpy.and.callFake((callback: Function) => {
            const result = callback(input, context);

            expect(result).toBe(isChanged);
            expect();
        });

        keyboardEnter(editor, rawEvent);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(input).toEqual(output);
        expect(context.newPendingFormat).toEqual(pendingFormat);
    }

    it('Empty model, no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            false,
            undefined
        );
    });

    it('Single paragraph, only have selection marker', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: { fontSize: '10pt' },
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: { fontSize: '10pt' },
                            },
                        ],
                        segmentFormat: { fontSize: '10pt' },
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: { fontSize: '10pt' },
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            true,
            { fontSize: '10pt' }
        );
    });

    it('Single paragraph, all text are selected', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                isSelected: true,
                                text: 'test',
                                format: { fontSize: '10pt' },
                            },
                        ],
                    },
                ],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: { fontSize: '10pt' },
                            },
                        ],
                        segmentFormat: { fontSize: '10pt' },
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: { fontSize: '10pt' },
                            },
                            {
                                segmentType: 'Br',
                                format: { fontSize: '10pt' },
                            },
                        ],
                        segmentFormat: { fontSize: '10pt' },
                    },
                ],
            },
            true,
            { fontSize: '10pt' }
        );
    });

    it('Multiple paragraph, single selection', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(createBr());
        para2.segments.push(createBr());

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    para1,
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            text1,
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            text2,
                        ],
                    },
                    para2,
                ],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    para1,
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [text1],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            text2,
                        ],
                    },
                    para2,
                ],
            },
            true,
            {}
        );
    });

    it('Multiple paragraph, select from line end to line start', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();

        para1.segments.push(text1, marker1);
        para2.segments.push(marker2, text2);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [para1, para2],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [text1],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [marker1, text2],
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Multiple paragraph, select text across lines', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        text2.isSelected = true;
        text3.isSelected = true;

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [para1, para2],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [text1],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                            text4,
                        ],
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Empty paragraph in quote', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const quote = createFormatContainer('blockquote');
        const marker = createSelectionMarker();
        const br1 = createBr();
        const br2 = createBr();
        const br3 = createBr();

        para1.segments.push(br1);
        para2.segments.push(marker, br2);
        para3.segments.push(br3);
        quote.blocks.push(para2);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [para1, quote, para3],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [para1, para2, para3],
            },
            true,
            {}
        );
    });

    it('Empty paragraph in middle of quote', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const quote = createFormatContainer('blockquote');
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const br = createBr();
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(marker, br);
        para3.segments.push(text3);
        quote.blocks.push(para1, para2, para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [quote],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockGroupType: 'FormatContainer',
                        blockType: 'BlockGroup',
                        blocks: [para1],
                        format: {},
                        tagName: 'blockquote',
                    },
                    para2,
                    {
                        blockGroupType: 'FormatContainer',
                        blockType: 'BlockGroup',
                        blocks: [para3],
                        format: {},
                        tagName: 'blockquote',
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Empty paragraph in middle of quote, not empty', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const quote = createFormatContainer('blockquote');
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('text2');
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(marker, text2);
        para3.segments.push(text3);
        quote.blocks.push(para1, para2, para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [quote],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockGroupType: 'FormatContainer',
                        blockType: 'BlockGroup',
                        blocks: [
                            para1,
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                            },
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [marker, text2],
                            },
                            para3,
                        ],
                        format: {},
                        tagName: 'blockquote',
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Empty paragraph in middle of quote, shift', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const quote = createFormatContainer('blockquote');
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const br = createBr();
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(marker, br);
        para3.segments.push(text3);
        quote.blocks.push(para1, para2, para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [quote],
            },
            true,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockGroupType: 'FormatContainer',
                        blockType: 'BlockGroup',
                        blocks: [
                            para1,
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [marker, br],
                                format: {},
                            },
                            para3,
                        ],
                        format: {},
                        tagName: 'blockquote',
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Single empty list item', () => {
        const para1 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const marker = createSelectionMarker();
        const br = createBr();

        para1.segments.push(marker, br);
        list1.blocks.push(para1);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [para1],
            },
            true,
            {}
        );
    });

    it('Single empty list item, shift', () => {
        const para1 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const marker = createSelectionMarker();
        const br = createBr();

        para1.segments.push(marker, br);
        list1.blocks.push(para1);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1],
            },
            true,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockGroupType: 'ListItem',
                        blockType: 'BlockGroup',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                            },
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    marker,
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                            },
                        ],
                        levels: [listLevel],
                    },
                ],
            },
            true,
            {}
        );
    });

    it('First empty list item', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const list2 = createListItem([listLevel]);
        const list3 = createListItem([listLevel]);
        const marker = createSelectionMarker();
        const br = createBr();
        const text2 = createText('test2');
        const text3 = createText('test3');

        para1.segments.push(marker, br);
        para2.segments.push(text2);
        para3.segments.push(text3);
        list1.blocks.push(para1);
        list2.blocks.push(para2);
        list3.blocks.push(para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1, list2, list3],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [para1, list2, list3],
            },
            true,
            {}
        );
    });

    it('List item with text', () => {
        const para1 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        list1.blocks.push(para1);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [text1],
                                format: {},
                            },
                        ],
                        levels: [listLevel],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [marker, text2],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {
                                    startNumberOverride: undefined,
                                    displayForDummyItem: undefined,
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Selection across list items', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const list3 = createListItem([listLevel]);
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');

        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3);
        para3.segments.push(text4, text5);
        list1.blocks.push(para1);
        list3.blocks.push(para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1, para2, list3],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [text1],
                                format: {},
                            },
                        ],
                        levels: [listLevel],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
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
                                    text5,
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: undefined,
                                    displayForDummyItem: undefined,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('Selection across list items, shift', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const list3 = createListItem([listLevel]);
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');

        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3);
        para3.segments.push(text4, text5);
        list1.blocks.push(para1);
        list3.blocks.push(para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1, para2, list3],
            },
            true,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [text1],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                    text5,
                                ],
                                format: {},
                            },
                        ],
                        levels: [listLevel],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('multiple blocks under list item', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listLevel = createListLevel('OL');
        const list1 = createListItem([listLevel]);
        const list2 = createListItem([listLevel]);
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        para1.segments.push(text1, marker, text2);
        para2.segments.push(text3);
        para3.segments.push(text4);
        list1.blocks.push(para1, para2);
        list2.blocks.push(para3);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list1, list2],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [text1],
                                format: {},
                            },
                        ],
                        levels: [listLevel],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [marker, text2],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [text3],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: undefined,
                                    displayForDummyItem: undefined,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [text4],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: undefined,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('selection is in table', () => {
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const td = createTableCell();
        const table = createTable(1);

        table.rows[0].cells.push(td);
        td.blocks.push(para1);
        para1.segments.push(text1, marker, text2);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [table],
            },
            false,
            {
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
                                                blockType: 'Paragraph',
                                                segments: [text1],
                                                format: {},
                                            },
                                            {
                                                blockType: 'Paragraph',
                                                segments: [marker, text2],
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
            },
            true,
            {}
        );
    });

    it('selection is in table, under list', () => {
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const td = createTableCell();
        const table = createTable(1);

        const listLevel = createListLevel('OL');
        const list = createListItem([listLevel]);

        table.rows[0].cells.push(td);
        td.blocks.push(para1);
        para1.segments.push(text1, marker, text2);
        list.blocks.push(table);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [list],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
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
                                                        blockType: 'Paragraph',
                                                        segments: [text1],
                                                        format: {},
                                                    },
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [marker, text2],
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
                        levels: [{ listType: 'OL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('selection is in table, under quote', () => {
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const td = createTableCell();
        const table = createTable(1);

        const quote = createFormatContainer('blockquote');

        table.rows[0].cells.push(td);
        td.blocks.push(para1);
        para1.segments.push(text1, marker, text2);
        quote.blocks.push(table);

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [quote],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
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
                                                        blockType: 'Paragraph',
                                                        segments: [text1],
                                                        format: {},
                                                    },
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [marker, text2],
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
                        format: {},
                        tagName: 'blockquote',
                    },
                ],
            },
            true,
            {}
        );
    });

    it('selection across table 1', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const td = createTableCell();
        const table = createTable(1);

        table.rows[0].cells.push(td);
        td.blocks.push(para2);
        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        text2.isSelected = true;
        text3.isSelected = true;

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [para1, table],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [text1],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                            { segmentType: 'Br', format: {} },
                        ],
                        format: {},
                    },
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
                                                blockType: 'Paragraph',
                                                segments: [text4],
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
            },
            true,
            {}
        );
    });

    it('selection across table 2', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const td = createTableCell();
        const table = createTable(1);

        table.rows[0].cells.push(td);
        td.blocks.push(para1);
        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        text2.isSelected = true;
        text3.isSelected = true;

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [table, para2],
            },
            false,
            {
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
                                                blockType: 'Paragraph',
                                                segments: [text1],
                                                format: {},
                                            },
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'SelectionMarker',
                                                        isSelected: true,
                                                        format: {},
                                                    },
                                                    { segmentType: 'Br', format: {} },
                                                ],
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
                    {
                        blockType: 'Paragraph',
                        segments: [text4],
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });

    it('selection cover table', () => {
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');
        const td = createTableCell();
        const table = createTable(1);

        table.rows[0].cells.push(td);
        td.blocks.push(para2);
        para1.segments.push(text1, text2);
        para2.segments.push(text3);
        para3.segments.push(text4, text5);

        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        td.isSelected = true;

        runTest(
            {
                blockGroupType: 'Document',
                blocks: [para1, table, para3],
            },
            false,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [text1],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                            text5,
                        ],
                        format: {},
                    },
                ],
            },
            true,
            {}
        );
    });
});
