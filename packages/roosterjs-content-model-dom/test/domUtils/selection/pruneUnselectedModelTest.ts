import { pruneUnselectedModel } from '../../../lib/domUtils/selection/pruneUnselectedModel';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createEntity,
    createFormatContainer,
    createGeneralSegment,
    createImage,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('pruneUnselectedModel', () => {
    it('handles empty document by removing all blocks  ', () => {
        const group = createContentModelDocument();
        pruneUnselectedModel(group);

        expect(group).toEqual({ blockGroupType: 'Document', blocks: [] });
    });

    it('removes all blocks when no selection exists', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({ blockGroupType: 'Document', blocks: [] });
    });

    it('retains a single selected segment in a paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('retains multiple selected segments across paragraphs', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text2', format: {}, isSelected: true },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('retains selection inside a list item', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        listItem.blocks.push(para1);

        group.blocks.push(listItem);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('retains list and text after a paragraph', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        listItem.blocks.push(para1);

        group.blocks.push(listItem);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
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
                                    segmentType: 'Text',
                                    text: 'text1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: false, format: {} },
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text2', format: {}, isSelected: true },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('retains selection inside a blockquote', () => {
        const group = createContentModelDocument();
        const quote = createFormatContainer('blockquote');
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        quote.blocks.push(para1);

        group.blocks.push(quote);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('retains selection inside a table cell', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell.blocks.push(para1);
        table.rows = [{ format: {}, height: 0, cells: [cell] }];

        group.blocks.push(table);
        group.blocks.push(para2);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('retains selection inside nested table, list, and blockquote', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const quote = createFormatContainer('blockquote');
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem.blocks.push(para1);
        quote.blocks.push(listItem);
        cell.blocks.push(quote);
        table.rows = [{ format: {}, height: 0, cells: [cell] }];

        group.blocks.push(table);
        group.blocks.push(para2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles table selection with selected cell content', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell1.blocks.push(para2);
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text1', format: {} },
                                            ],
                                            format: {},
                                        },
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text2', format: {} },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
    });

    it('handles table selection ignoring selected cell content', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell1.blocks.push(para2);
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text1', format: {} },
                                            ],
                                            format: {},
                                        },
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text2', format: {} },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
    });

    it('handles whole table selection ignoring selected cell content', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;
        cell2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell2.blocks.push(para2);
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text1', format: {} },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                { segmentType: 'Text', text: 'text2', format: {} },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
    });

    it('handles selection spanning from the end of one paragraph to another', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker);
        para2.segments.push(text);
        group.blocks.push(para1);
        group.blocks.push(para2);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test', format: {}, isSelected: true }],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection spanning to the start of a paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(text);
        para2.segments.push(marker);
        group.blocks.push(para1);
        group.blocks.push(para2);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test', format: {}, isSelected: true }],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection spanning from the end to the start of a paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const para3 = createParagraph(false, { lineHeight: '40px' });
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker1);
        para2.segments.push(text);
        para3.segments.push(marker2);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test', format: {}, isSelected: true }],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection spanning multiple paragraphs', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        para1.segments.push(marker1);
        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para3.segments.push(marker2);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test2', format: {}, isSelected: true },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test3', format: {}, isSelected: true },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('includes format holder when selection spans a list item', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para = createParagraph();
        const text = createText('test1');

        text.isSelected = true;
        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('excludes format holder when not all segments in a list item are selected', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection inside a general node', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        generalSpan.blocks.push(para);
        group.blocks.push(generalSpan);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection inside a general segment', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para1.segments.push(generalSpan);
        generalSpan.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(para1, para2);
        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'test1',
                                            format: {},
                                            isSelected: true,
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            element: jasmine.anything(),
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles empty general segment with no selection', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);

        para1.segments.push(generalSpan);
        group.blocks.push(para1);

        pruneUnselectedModel(group);
        expect(group).toEqual({ blockGroupType: 'Document', blocks: [] });
    });

    it('handles general segment with selected content', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        para2.segments.push(text1, text2);
        generalSpan.blocks.push(para2);
        para1.segments.push(generalSpan);
        group.blocks.push(para1);

        text2.isSelected = true;

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'test1',
                                            format: {},
                                            isSelected: true,
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            element: jasmine.anything(),
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles empty selected general segment', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);

        generalSpan.isSelected = true;
        para1.segments.push(generalSpan);
        group.blocks.push(para1);
        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [],
                            element: jasmine.anything(),
                            isSelected: true,
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selected general segment with content', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        generalSpan.isSelected = true;
        para1.segments.push(generalSpan);
        generalSpan.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(para1);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [],
                            element: jasmine.anything(),
                            isSelected: true,
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection of a divider', () => {
        const group = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        group.blocks.push(divider);

        pruneUnselectedModel(group);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [{ blockType: 'Divider', tagName: 'div', format: {}, isSelected: true }],
        });
    });

    it('retains first selection in nested block groups', () => {
        const group = createContentModelDocument();
        const quote1 = createFormatContainer('blockquote');
        const quote2 = createFormatContainer('blockquote');
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote1.blocks.push(para1);
        quote2.blocks.push(para2);
        group.blocks.push(quote1);
        group.blocks.push(quote2);

        pruneUnselectedModel(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],

                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('retains whole table selection', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const text = createText('text');

        cell.isSelected = true;
        text.isSelected = true;

        para.segments.push(text);
        table.rows[0].cells.push(cell);
        group.blocks.push(table);
        group.blocks.push(para);

        pruneUnselectedModel(group);
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
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
                    segments: [{ segmentType: 'Text', text: 'text', format: {}, isSelected: true }],
                    format: {},
                },
            ],
        });
    });

    it('retains selection of specific table cells', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });

        cell1.isSelected = true;
        cell2.isSelected = true;
        cell3.isSelected = true;

        table.rows[0].cells.push(cell1, cell2, cell3);
        group.blocks.push(table);

        pruneUnselectedModel(group);
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
                                    blocks: [],
                                    format: { textAlign: 'start' },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: { textAlign: 'center' },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: { textAlign: 'end' },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
    });

    it('includes list format holder when any segment is selected', () => {
        const doc = createContentModelDocument();
        const list = createListItem([createListLevel('OL')]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        pruneUnselectedModel(doc);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test2', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('includes list format holder when all segments are selected', () => {
        const doc = createContentModelDocument();
        const list = createListItem([createListLevel('OL')]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text1.isSelected = true;
        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        pruneUnselectedModel(doc);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {}, isSelected: true },
                        { segmentType: 'Text', text: 'test2', format: {}, isSelected: true },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles selection of an entity segment', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const entity = createEntity(null!);

        entity.isSelected = true;

        para.segments.push(entity);
        doc.blocks.push(para);

        pruneUnselectedModel(doc);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            format: {},
                            entityFormat: {
                                isReadonly: true,
                                id: undefined,
                                entityType: undefined,
                            },
                            wrapper: <any>null,
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                    format: {},
                },
            ],
        });
    });

    it('handles selection of an entity block', () => {
        const doc = createContentModelDocument();
        const entity = createEntity(null!);

        entity.isSelected = true;

        doc.blocks.push(entity);

        pruneUnselectedModel(doc);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { isReadonly: true, id: undefined, entityType: undefined },
                    wrapper: <any>null,
                    isSelected: true,
                },
            ],
        });
    });

    it('Inherits the segment format to child segments', () => {
        const doc = createContentModelDocument();
        const para = createParagraph(
            false /* isImplicit */,
            {
                backgroundColor: 'red',
            },
            {
                backgroundColor: 'blue',
                fontSize: '12px',
            }
        );
        const segment1 = createText('Text1');
        const segment2 = createBr();
        const segment3 = createGeneralSegment(document.createElement('span'));
        const segment4 = createEntity(document.createElement('span'));
        const segment5 = createImage('https://www.bing.com');

        segment1.isSelected = true;
        segment2.isSelected = true;
        segment3.isSelected = true;
        segment4.isSelected = true;
        segment5.isSelected = true;

        para.segments.push(segment1, segment2, segment3, segment4, segment5);
        doc.blocks.push(para);

        pruneUnselectedModel(doc);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text1',
                            format: { backgroundColor: 'blue', fontSize: '12px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: { backgroundColor: 'blue', fontSize: '12px' },
                            isSelected: true,
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: { backgroundColor: 'blue', fontSize: '12px' },
                            blocks: [],
                            element: jasmine.anything(),
                            isSelected: true,
                        },
                        {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            format: { backgroundColor: 'blue', fontSize: '12px' },
                            entityFormat: {
                                isReadonly: true,
                                id: undefined,
                                entityType: undefined,
                            },
                            wrapper: jasmine.anything(),
                            isSelected: true,
                        },
                        {
                            segmentType: 'Image',
                            src: 'https://www.bing.com',
                            format: { backgroundColor: 'blue', fontSize: '12px' },
                            dataset: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                    segmentFormat: { backgroundColor: 'blue', fontSize: '12px' },
                    isImplicit: true,
                },
            ],
        });
    });

    it('Inherits the segment format to child segments, but retain the format if existent', () => {
        const doc = createContentModelDocument();
        const para = createParagraph(
            false /* isImplicit */,
            {
                backgroundColor: 'red',
            },
            {
                backgroundColor: 'blue',
                fontSize: '12px',
                textColor: 'aquamarine',
            }
        );
        const segment1 = createText('Text1', {
            backgroundColor: 'red',
            fontSize: '10px',
        });
        const segment2 = createBr({
            backgroundColor: 'red',
            fontSize: '10px',
        });
        const segment3 = createGeneralSegment(document.createElement('span'), {
            backgroundColor: 'red',
            fontSize: '10px',
        });
        const segment4 = createEntity(document.createElement('span'), false, {
            backgroundColor: 'red',
            fontSize: '10px',
        });
        const segment5 = createImage('https://www.bing.com', {
            backgroundColor: 'red',
            fontSize: '10px',
        });

        segment1.isSelected = true;
        segment2.isSelected = true;
        segment3.isSelected = true;
        segment4.isSelected = true;
        segment5.isSelected = true;

        para.segments.push(segment1, segment2, segment3, segment4, segment5);
        doc.blocks.push(para);

        pruneUnselectedModel(doc);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text1',
                            format: {
                                backgroundColor: 'red',
                                fontSize: '10px',
                                textColor: 'aquamarine',
                            },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                backgroundColor: 'red',
                                fontSize: '10px',
                                textColor: 'aquamarine',
                            },
                            isSelected: true,
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {
                                backgroundColor: 'red',
                                fontSize: '10px',
                                textColor: 'aquamarine',
                            },
                            blocks: [],
                            element: jasmine.anything(),
                            isSelected: true,
                        },
                        {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            format: {
                                backgroundColor: 'red',
                                fontSize: '10px',
                                textColor: 'aquamarine',
                            },
                            entityFormat: {
                                isReadonly: false,
                                id: undefined,
                                entityType: undefined,
                            },
                            wrapper: jasmine.anything(),
                            isSelected: true,
                        },
                        {
                            segmentType: 'Image',
                            src: 'https://www.bing.com',
                            format: {
                                backgroundColor: 'red',
                                fontSize: '10px',
                                textColor: 'aquamarine',
                            },
                            dataset: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        backgroundColor: 'blue',
                        fontSize: '12px',
                        textColor: 'aquamarine',
                    },
                    isImplicit: true,
                },
            ],
        });
    });
});
