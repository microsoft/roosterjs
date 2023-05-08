import { clearModelFormat } from '../../../lib/modelApi/common/clearModelFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('clearModelFormat', () => {
    it('Empty model', () => {
        const model = createContentModelDocument();

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, [], [], []);

        expect(model).toEqual({ blockGroupType: 'Document', blocks: [] });
        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
    });

    it('Model without selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'red' });

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        para.segments.push(text);
        model.blocks.push(para);

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10px' },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { textColor: 'red' },
                            text: 'test',
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
    });

    it('Model with text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false, { lineHeight: '10px' });
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        text2.isSelected = true;

        para.segments.push(text1, text2);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10px' },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { textColor: 'red' },
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([text2]);
        expect(tables).toEqual([]);
    });

    it('Model with link', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false);
        const text1 = createText('test1');

        text1.link = {
            dataset: {},
            format: {
                href: 'test',
                textColor: 'red',
            },
        };
        text1.isSelected = true;

        para.segments.push(text1);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                            isSelected: true,
                            link: {
                                dataset: {},
                                format: {
                                    href: 'test',
                                },
                            },
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([text1]);
        expect(tables).toEqual([]);
    });

    it('Model with code', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false);
        const text1 = createText('test1');

        text1.code = {
            format: {
                fontFamily: 'monospace',
            },
        };
        text1.isSelected = true;

        para.segments.push(text1);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([text1]);
        expect(tables).toEqual([]);
    });

    it('Model with text selection in whole paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false, { lineHeight: '10px' });
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        text1.isSelected = true;
        text2.isSelected = true;

        para.segments.push(text1, text2);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([text1, text2]);
        expect(tables).toEqual([]);
    });

    it('Model with collapsed selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false, { lineHeight: '10px' });
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });
        const marker = createSelectionMarker();

        para.segments.push(text1, text2, marker);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10px' },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { textColor: 'red' },
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: { textColor: 'green' },
                            text: 'test2',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([marker]);
        expect(tables).toEqual([]);
    });

    it('Model with collapsed selection inside word', () => {
        const model = createContentModelDocument();
        const para = createParagraph(false, { lineHeight: '10px' });
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText(' test2', { textColor: 'green' });
        const marker = createSelectionMarker();
        const text3 = createText('test3', { textColor: 'blue' });

        para.segments.push(text1, text2, marker, text3);
        model.blocks.push(para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {
                                textColor: 'red',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: ' ',
                            format: {
                                textColor: 'green',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test3',
                            format: {},
                        },
                    ],
                    format: {
                        lineHeight: '10px',
                    },
                },
            ],
        });
        expect(blocks).toEqual([[[model], para]]);
        expect(segments).toEqual([
            {
                segmentType: 'Text',
                text: 'test2',
                format: {},
            },
            marker,
            text3,
        ]);
        expect(tables).toEqual([]);
    });

    it('Model with collapsed selection under list', () => {
        const model = createContentModelDocument();
        const list = createListItem([
            {
                listType: 'OL',
            },
        ]);
        const para = createParagraph(false, { lineHeight: '10px' });
        const marker = createSelectionMarker();

        para.segments.push(marker);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
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
                            ],
                            format: {
                                lineHeight: '10px',
                            },
                        },
                    ],
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
        expect(blocks).toEqual([[[list, model], para]]);
        expect(segments).toEqual([marker]);
        expect(tables).toEqual([]);
    });

    it('Model with divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('hr');
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'green' });

        divider.isSelected = true;

        para.segments.push(text);
        model.blocks.push(divider, para);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        lineHeight: '10px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { textColor: 'green' },
                            text: 'test',
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[model], divider]]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
    });

    it('Model with selection under list', () => {
        const model = createContentModelDocument();
        const list = createListItem([{ listType: 'OL' }], { fontSize: '20px' });
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'green' });

        text.isSelected = true;

        para.segments.push(text);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[list, model], para]]);
        expect(segments).toEqual([
            text,
            {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
        ]);
        expect(tables).toEqual([]);
    });

    it('Model with selection under list, has defaultSegmentFormat', () => {
        const model = createContentModelDocument({
            fontSize: '10px',
        });
        const list = createListItem([{ listType: 'OL' }], { fontSize: '20px' });
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'green' });

        text.isSelected = true;

        para.segments.push(text);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            format: {
                fontSize: '10px',
            },
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {
                            fontSize: '20px',
                        },
                        isSelected: true,
                    },
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {
                                        fontSize: '10px',
                                    },
                                    text: 'test',
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([[[list, model], para]]);
        expect(segments).toEqual([text]);
        expect(tables).toEqual([]);
    });

    it('Model with selection under quote', () => {
        const model = createContentModelDocument();
        const quote = createQuote({ lineHeight: '25px' });
        const para1 = createParagraph(false, { lineHeight: '10px' });
        const para2 = createParagraph(false, { lineHeight: '20px' });
        const para3 = createParagraph(false, { lineHeight: '30px' });
        const para4 = createParagraph(false, { lineHeight: '40px' });
        const para5 = createParagraph(false, { lineHeight: '50px' });
        const para6 = createParagraph(false, { lineHeight: '60px' });
        const text3 = createText('test3', { textColor: 'green' });
        const text4 = createText('test4', { textColor: 'red' });

        text3.isSelected = true;
        text4.isSelected = true;

        para3.segments.push(text3);
        para4.segments.push(text4);
        quote.blocks.push(para2, para3, para4, para5);
        model.blocks.push(para1, quote, para6);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10px' },
                    segments: [],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: { lineHeight: '25px' },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: { lineHeight: '20px' },
                            segments: [],
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        lineHeight: '25px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test4',
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: { lineHeight: '25px' },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: { lineHeight: '50px' },
                            segments: [],
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '60px' },
                    segments: [],
                },
            ],
        });
        expect(blocks).toEqual([
            [[quote, model], para3],
            [[quote, model], para4],
        ]);
        expect(segments).toEqual([text3, text4]);
        expect(tables).toEqual([]);
    });

    it('Model with selection under table', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();

        table.format.backgroundColor = 'red';
        cell1.format.backgroundColor = 'green';
        cell2.format.backgroundColor = 'blue';

        cell1.isSelected = true;
        cell2.isSelected = true;

        table.rows[0].cells.push(cell1, cell2);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: { useBorderBox: undefined, borderCollapse: undefined },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0}',
                    },
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {
                                        useBorderBox: undefined,
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    blocks: [],
                                    isSelected: true,
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    format: {
                                        useBorderBox: undefined,
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    blocks: [],
                                    isSelected: true,
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([[table, true]]);
    });
});
