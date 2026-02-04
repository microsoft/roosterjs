import { getSelectedContent, insertTableContent } from '../../../lib/modelApi/table/tableContent';
import { ContentModelBlock, ContentModelDocument } from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createTable,
    createTableCell,
    createText,
    createListItem,
    createListLevel,
    createFormatContainer,
    createImage,
    createDivider,
} from 'roosterjs-content-model-dom';

describe('getSelectedContent', () => {
    it('should return empty array when no selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createText('text'));
        model.blocks.push(para);

        const result = getSelectedContent(model);

        expect(result).toEqual([]);
    });

    it('should return single paragraph with selected text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('selected text');
        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        const result = getSelectedContent(model);

        expect(result.length).toBe(1);
        expect(result[0].length).toBe(1);
        expect(result[0][0].blockType).toBe('Paragraph');
        const resultPara = result[0][0] as any;
        expect(resultPara.segments[0].text).toBe('selected text');
    });

    it('should return multiple paragraphs as separate rows', () => {
        const model = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('Line 1');
        text1.isSelected = true;
        para1.segments.push(text1);

        const para2 = createParagraph();
        const text2 = createText('Line 2');
        text2.isSelected = true;
        para2.segments.push(text2);

        const para3 = createParagraph();
        const text3 = createText('Line 3');
        text3.isSelected = true;
        para3.segments.push(text3);

        model.blocks.push(para1, para2, para3);

        const result = getSelectedContent(model);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(1);
        expect(result[1].length).toBe(1);
        expect(result[2].length).toBe(1);

        expect((result[0][0] as any).segments[0].text).toBe('Line 1');
        expect((result[1][0] as any).segments[0].text).toBe('Line 2');
        expect((result[2][0] as any).segments[0].text).toBe('Line 3');
    });

    it('should return list items as block groups', () => {
        const model = createContentModelDocument();

        const listItem1 = createListItem([createListLevel('UL')]);
        const para1 = createParagraph();
        const text1 = createText('Item 1');
        text1.isSelected = true;
        para1.segments.push(text1);
        listItem1.blocks.push(para1);

        const listItem2 = createListItem([createListLevel('UL')]);
        const para2 = createParagraph();
        const text2 = createText('Item 2');
        text2.isSelected = true;
        para2.segments.push(text2);
        listItem2.blocks.push(para2);

        model.blocks.push(listItem1, listItem2);

        const result = getSelectedContent(model);

        expect(result.length).toBe(2);
        expect(result[0][0].blockType).toBe('BlockGroup');
        expect((result[0][0] as any).blockGroupType).toBe('ListItem');
        expect(result[1][0].blockType).toBe('BlockGroup');
        expect((result[1][0] as any).blockGroupType).toBe('ListItem');
    });

    it('should extract content from table cells preserving rows', () => {
        const model = createContentModelDocument();

        // Create a 2x2 table with content
        const table = createTable(2);

        // Row 0
        const cell00 = createTableCell();
        const para00 = createParagraph();
        const text00 = createText('Cell 0,0');
        text00.isSelected = true;
        para00.segments.push(text00);
        cell00.blocks.push(para00);
        cell00.isSelected = true;

        const cell01 = createTableCell();
        const para01 = createParagraph();
        const text01 = createText('Cell 0,1');
        text01.isSelected = true;
        para01.segments.push(text01);
        cell01.blocks.push(para01);
        cell01.isSelected = true;

        table.rows[0].cells.push(cell00, cell01);

        // Row 1
        const cell10 = createTableCell();
        const para10 = createParagraph();
        const text10 = createText('Cell 1,0');
        text10.isSelected = true;
        para10.segments.push(text10);
        cell10.blocks.push(para10);
        cell10.isSelected = true;

        const cell11 = createTableCell();
        const para11 = createParagraph();
        const text11 = createText('Cell 1,1');
        text11.isSelected = true;
        para11.segments.push(text11);
        cell11.blocks.push(para11);
        cell11.isSelected = true;

        table.rows[1].cells.push(cell10, cell11);

        model.blocks.push(table);

        const result = getSelectedContent(model);

        // Should have 2 rows with 2 blocks each
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(2);
        expect(result[1].length).toBe(2);

        expect((result[0][0] as any).segments[0].text).toBe('Cell 0,0');
        expect((result[0][1] as any).segments[0].text).toBe('Cell 0,1');
        expect((result[1][0] as any).segments[0].text).toBe('Cell 1,0');
        expect((result[1][1] as any).segments[0].text).toBe('Cell 1,1');
    });

    it('should handle table cell selection with tableContext', () => {
        const model: ContentModelDocument = {
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
                                                {
                                                    segmentType: 'Text',
                                                    text: 'A1',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    isSelected: true,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'B1',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    isSelected: true,
                                    dataset: {},
                                },
                            ],
                        },
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
                                                {
                                                    segmentType: 'Text',
                                                    text: 'A2',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    isSelected: true,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'B2',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    isSelected: true,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [100, 100],
                    dataset: {},
                },
            ],
        };

        const result = getSelectedContent(model);

        // Should preserve row structure: 2 rows with 2 cells each
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(2);
        expect(result[1].length).toBe(2);
    });

    it('should handle divider block', () => {
        const model = createContentModelDocument();
        const divider = createDivider('hr');
        (divider as any).isSelected = true;
        model.blocks.push(divider);

        const result = getSelectedContent(model);

        expect(result.length).toBe(1);
        expect(result[0][0].blockType).toBe('Divider');
    });

    it('should handle format container (blockquote)', () => {
        const model = createContentModelDocument();
        const container = createFormatContainer('blockquote');
        const para = createParagraph();
        const text = createText('Quote text');
        text.isSelected = true;
        para.segments.push(text);
        container.blocks.push(para);
        model.blocks.push(container);

        const result = getSelectedContent(model);

        expect(result.length).toBe(1);
        expect(result[0][0].blockType).toBe('BlockGroup');
        expect((result[0][0] as any).blockGroupType).toBe('FormatContainer');
    });

    it('should handle image segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const image = createImage('test.jpg');
        image.isSelected = true;
        para.segments.push(image);
        model.blocks.push(para);

        const result = getSelectedContent(model);

        expect(result.length).toBe(1);
        expect(result[0][0].blockType).toBe('Paragraph');
        const resultPara = result[0][0] as any;
        expect(resultPara.segments[0].segmentType).toBe('Image');
        expect(resultPara.segments[0].src).toBe('test.jpg');
    });
});

describe('insertTableContent', () => {
    it('should insert content into existing rows', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2]];

        insertTableContent(table, contentRows, 2);

        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para2);
    });

    it('should create new rows when content exceeds existing rows', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell(), createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const para3 = createParagraph();
        para3.segments.push(createText('Row 3'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2], [para3]];

        insertTableContent(table, contentRows, 2);

        expect(table.rows.length).toBe(3);
        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para2);
        expect(table.rows[2].cells[0].blocks[0]).toBe(para3);

        // New rows should have correct number of cells
        expect(table.rows[1].cells.length).toBe(2);
        expect(table.rows[2].cells.length).toBe(2);
    });

    it('should insert multiple blocks per row into corresponding cells', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const para00 = createParagraph();
        para00.segments.push(createText('Cell 0,0'));

        const para01 = createParagraph();
        para01.segments.push(createText('Cell 0,1'));

        const para10 = createParagraph();
        para10.segments.push(createText('Cell 1,0'));

        const para11 = createParagraph();
        para11.segments.push(createText('Cell 1,1'));

        const contentRows: ContentModelBlock[][] = [
            [para00, para01],
            [para10, para11],
        ];

        insertTableContent(table, contentRows, 2);

        expect(table.rows[0].cells[0].blocks[0]).toBe(para00);
        expect(table.rows[0].cells[1].blocks[0]).toBe(para01);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para10);
        expect(table.rows[1].cells[1].blocks[0]).toBe(para11);
    });

    it('should apply custom cell format to new rows', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2]];
        const customFormat = { minWidth: '50px' };

        insertTableContent(table, contentRows, 2, customFormat);

        expect(table.rows.length).toBe(2);
        expect(table.rows[1].cells[0].format).toEqual(customFormat);
        expect(table.rows[1].cells[1].format).toEqual(customFormat);
    });

    it('should not insert content beyond available cells', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell()); // Only 1 cell

        const para1 = createParagraph();
        para1.segments.push(createText('Cell 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Cell 2'));

        const para3 = createParagraph();
        para3.segments.push(createText('Cell 3'));

        // 3 blocks but only 1 cell
        const contentRows: ContentModelBlock[][] = [[para1, para2, para3]];

        insertTableContent(table, contentRows, 1);

        // Only first block should be inserted
        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[0].cells.length).toBe(1);
    });

    it('should handle empty content rows', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const contentRows: ContentModelBlock[][] = [];

        insertTableContent(table, contentRows, 2);

        // Table should remain unchanged
        expect(table.rows.length).toBe(2);
        expect(table.rows[0].cells[0].blocks.length).toBe(0);
    });
});
