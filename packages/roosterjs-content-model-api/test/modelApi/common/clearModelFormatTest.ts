import { clearModelFormat } from '../../../lib/modelApi/common/clearModelFormat';
import {
    ContentModelBlockFormat,
    ContentModelFormatContainerFormat,
    ContentModelListItemLevelFormat,
    ContentModelSegmentFormat,
    ContentModelTableCellFormat,
    ContentModelTableFormat,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelParagraphDecorator,
    ReadonlyDatasetFormat,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createDivider as originalCreateDivider,
    createFormatContainer as originalCreateFormatContainer,
    createListItem as originalCreateListItem,
    createListLevel as originalCreateListLevel,
    createParagraph as originalCreateParagraph,
    createSelectionMarker,
    createTable as originalCreateTable,
    createTableCell as originalCreateTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('clearModelFormat', () => {
    const mockedCachedElement = 'CACHE' as any;

    function createDivider(tagName: 'hr' | 'div', format?: Readonly<ContentModelBlockFormat>) {
        const result = originalCreateDivider(tagName, format);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createFormatContainer(
        tag: Lowercase<string>,
        format?: Readonly<ContentModelFormatContainerFormat>
    ) {
        const result = originalCreateFormatContainer(tag, format);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createListItem(
        levels: ReadonlyArray<ReadonlyContentModelListLevel>,
        format?: Readonly<ContentModelSegmentFormat>
    ) {
        const result = originalCreateListItem(levels, format);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createListLevel(
        listType: 'OL' | 'UL',
        format?: Readonly<ContentModelListItemLevelFormat>,
        dataset?: ReadonlyDatasetFormat
    ) {
        const result = originalCreateListLevel(listType, format, dataset);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createParagraph(
        isImplicit?: boolean,
        blockFormat?: Readonly<ContentModelBlockFormat>,
        segmentFormat?: Readonly<ContentModelSegmentFormat>,
        decorator?: ReadonlyContentModelParagraphDecorator
    ) {
        const result = originalCreateParagraph(isImplicit, blockFormat, segmentFormat, decorator);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createTable(rowCount: number, format?: Readonly<ContentModelTableFormat>) {
        const result = originalCreateTable(rowCount, format);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    function createTableCell(
        spanLeftOrColSpan?: boolean | number,
        spanAboveOrRowSpan?: boolean | number,
        isHeader?: boolean,
        format?: Readonly<ContentModelTableCellFormat>,
        dataset?: ReadonlyDatasetFormat
    ) {
        const result = originalCreateTableCell(
            spanLeftOrColSpan,
            spanAboveOrRowSpan,
            isHeader,
            format,
            dataset
        );
        result.cachedElement = mockedCachedElement;
        return result;
    }

    it('Empty model', () => {
        const model = createContentModelDocument();

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, [], [], []);

        expect(model).toEqual({ blockGroupType: 'Document', blocks: [] });
        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
                    cachedElement: mockedCachedElement,
                },
            ],
        });
        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
        expect(result).toBeFalse();
    });

    it('Model with collapsed selection under list', () => {
        const model = createContentModelDocument();
        const list = createListItem([createListLevel('OL')]);
        const para = createParagraph(false, { lineHeight: '10px' });
        const marker = createSelectionMarker();

        para.segments.push(marker);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

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
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
        expect(blocks).toEqual([[[list, model], para]]);
        expect(segments).toEqual([marker]);
        expect(tables).toEqual([]);
        expect(result).toBeTrue();
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

        const result = clearModelFormat(model, blocks, segments, tables);

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
                    cachedElement: mockedCachedElement,
                },
            ],
        });
        expect(blocks).toEqual([[[model], divider]]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([]);
        expect(result).toBeFalse();
    });

    it('Model with selection under list', () => {
        const model = createContentModelDocument();
        const list = createListItem([createListLevel('OL')], { fontSize: '20px' });
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'green' });

        text.isSelected = true;

        para.segments.push(text);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

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
                        isSelected: false,
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
                isSelected: false,
            },
        ]);
        expect(tables).toEqual([]);
        expect(result).toBeTrue();
    });

    it('Model with selection under list, has defaultSegmentFormat', () => {
        const model = createContentModelDocument({
            fontSize: '10px',
        });
        const list = createListItem([createListLevel('OL')], { fontSize: '20px' });
        const para = createParagraph(false, { lineHeight: '10px' });
        const text = createText('test', { textColor: 'green' });

        text.isSelected = true;

        para.segments.push(text);
        list.blocks.push(para);
        model.blocks.push(list);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

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
                        isSelected: false,
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
        expect(result).toBeTrue();
    });

    it('Model with selection under quote', () => {
        const model = createContentModelDocument();
        const quote = createFormatContainer('blockquote', { lineHeight: '25px' });
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

        const result = clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10px' },
                    segments: [],
                    cachedElement: mockedCachedElement,
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
                            cachedElement: mockedCachedElement,
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
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '60px' },
                    segments: [],
                    cachedElement: mockedCachedElement,
                },
            ],
        });
        expect(blocks).toEqual([
            [[quote, model], para3],
            [[quote, model], para4],
        ]);
        expect(segments).toEqual([text3, text4]);
        expect(tables).toEqual([]);
        expect(result).toBeFalse();
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

        const result = clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: { useBorderBox: undefined, borderCollapse: undefined },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
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
        expect(result).toBeFalse();
    });

    it('Model with selection under table should preserve verticalAlign', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            backgroundColor: 'green',
            verticalAlign: 'middle',
            useBorderBox: true,
        });
        const cell2 = createTableCell(false, false, false, {
            backgroundColor: 'blue',
            verticalAlign: 'bottom',
            useBorderBox: true,
        });

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;
        cell2.isSelected = true;

        table.rows[0].cells.push(cell1, cell2);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: { useBorderBox: undefined, borderCollapse: undefined },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
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
                                        useBorderBox: true,
                                        verticalAlign: 'middle',
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
                                        useBorderBox: true,
                                        verticalAlign: 'bottom',
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
        expect(result).toBeFalse();
    });

    it('Model with selection under table should preserve height and width', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            backgroundColor: 'green',
            height: '100px',
            width: '200px',
            borderTop: '2px solid red',
            borderBottom: '2px solid red',
            borderLeft: '2px solid red',
            borderRight: '2px solid red',
        });

        // Set borderOverride so applyTableFormat doesn't overwrite borders
        cell1.dataset = {
            editingInfo: '{"borderOverride":true}',
        };

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: { useBorderBox: undefined, borderCollapse: undefined },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
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
                                        height: '100px',
                                        width: '200px',
                                        borderTop: '2px solid red',
                                        borderRight: '2px solid red',
                                        borderBottom: '2px solid red',
                                        borderLeft: '2px solid red',
                                    },
                                    dataset: {
                                        editingInfo: '{"borderOverride":true}',
                                    },
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
        expect(result).toBeFalse();
    });

    it('Model with selection under table should clear textAlign', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            backgroundColor: 'green',
            textAlign: 'center',
            verticalAlign: 'middle',
        });

        // Set vAlignOverride so applyTableFormat doesn't overwrite verticalAlign
        cell1.dataset = {
            editingInfo: '{"vAlignOverride":true}',
        };

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        // textAlign should be cleared, verticalAlign should be preserved
        const resultTable = model.blocks[0] as any;
        expect(resultTable.rows[0].cells[0].format.textAlign).toBeUndefined();
        expect(resultTable.rows[0].cells[0].format.verticalAlign).toBe('middle');

        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([[table, true]]);
        expect(result).toBeFalse();
    });

    it('Model with selection under table should preserve useBorderBox', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            backgroundColor: 'green',
            useBorderBox: true,
        });

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        const resultTable = model.blocks[0] as any;
        expect(resultTable.rows[0].cells[0].format.useBorderBox).toBe(true);
        expect(resultTable.rows[0].cells[0].format.backgroundColor).toBeUndefined();

        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([[table, true]]);
        expect(result).toBeFalse();
    });

    it('Model with selection under table should preserve borders', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            backgroundColor: 'green',
            borderTop: '3px solid blue',
            borderBottom: '3px solid blue',
            borderLeft: '3px solid blue',
            borderRight: '3px solid blue',
        });

        // Set borderOverride so applyTableFormat doesn't overwrite borders
        cell1.dataset = {
            editingInfo: '{"borderOverride":true}',
        };

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        const resultTable = model.blocks[0] as any;
        expect(resultTable.rows[0].cells[0].format.borderTop).toBe('3px solid blue');
        expect(resultTable.rows[0].cells[0].format.borderBottom).toBe('3px solid blue');
        expect(resultTable.rows[0].cells[0].format.borderLeft).toBe('3px solid blue');
        expect(resultTable.rows[0].cells[0].format.borderRight).toBe('3px solid blue');
        expect(resultTable.rows[0].cells[0].format.backgroundColor).toBeUndefined();

        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([[table, true]]);
        expect(result).toBeFalse();
    });

    it('Model with selection under table should clear non-preserved properties and keep preserved ones', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, {
            // Properties that should be preserved
            useBorderBox: true,
            verticalAlign: 'middle',
            height: '50px',
            width: '100px',
            borderTop: '2px solid black',
            borderBottom: '2px solid black',
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
            // Properties that should be cleared
            backgroundColor: 'green',
            textAlign: 'center',
            direction: 'rtl',
            htmlAlign: 'center',
            marginTop: '10px',
            marginBottom: '10px',
            marginLeft: '10px',
            marginRight: '10px',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '5px',
            paddingRight: '5px',
        });

        // Set overrides so applyTableFormat doesn't overwrite preserved values
        cell1.dataset = {
            editingInfo: '{"vAlignOverride":true,"borderOverride":true}',
        };

        table.format.backgroundColor = 'red';

        cell1.isSelected = true;

        table.rows[0].cells.push(cell1);
        model.blocks.push(table);

        const blocks: any[] = [];
        const segments: any[] = [];
        const tables: any[] = [];

        const result = clearModelFormat(model, blocks, segments, tables);

        const resultTable = model.blocks[0] as any;
        const cellFormat = resultTable.rows[0].cells[0].format;

        // Preserved properties should exist
        expect(cellFormat.useBorderBox).toBe(true);
        expect(cellFormat.verticalAlign).toBe('middle');
        expect(cellFormat.height).toBe('50px');
        expect(cellFormat.width).toBe('100px');
        expect(cellFormat.borderTop).toBe('2px solid black');
        expect(cellFormat.borderBottom).toBe('2px solid black');
        expect(cellFormat.borderLeft).toBe('2px solid black');
        expect(cellFormat.borderRight).toBe('2px solid black');

        // Cleared properties should not exist
        expect(cellFormat.backgroundColor).toBeUndefined();
        expect(cellFormat.textAlign).toBeUndefined();
        expect(cellFormat.direction).toBeUndefined();
        expect(cellFormat.htmlAlign).toBeUndefined();
        expect(cellFormat.marginTop).toBeUndefined();
        expect(cellFormat.marginBottom).toBeUndefined();
        expect(cellFormat.marginLeft).toBeUndefined();
        expect(cellFormat.marginRight).toBeUndefined();
        expect(cellFormat.paddingTop).toBeUndefined();
        expect(cellFormat.paddingBottom).toBeUndefined();
        expect(cellFormat.paddingLeft).toBeUndefined();
        expect(cellFormat.paddingRight).toBeUndefined();

        expect(blocks).toEqual([]);
        expect(segments).toEqual([]);
        expect(tables).toEqual([[table, true]]);
        expect(result).toBeFalse();
    });
});
