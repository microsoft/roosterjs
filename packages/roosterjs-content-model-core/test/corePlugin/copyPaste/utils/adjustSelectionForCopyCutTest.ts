import { adjustSelectionForCopyCut } from '../../../../lib/corePlugin/copyPaste/utils/adjustSelectionForCopyCut';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('adjustSelectionForCopyCut', () => {
    it('Empty document - no effect', () => {
        const model = createContentModelDocument();

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Document with no selection markers - no effect', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('Hello World');

        para.segments.push(text);
        model.blocks.push(para);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Hello World',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker in paragraph - no removal', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('Hello');

        para.segments.push(marker, text);
        model.blocks.push(para);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'Hello',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple selection markers in same table context - no removal for same table', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker1 = createSelectionMarker({ fontSize: '12pt' });
        const marker2 = createSelectionMarker({ fontSize: '14pt' });
        const text = createText('content');

        para1.segments.push(marker1, text);
        para2.segments.push(marker2);
        cell.blocks.push(para1, para2);
        row.cells.push(cell);
        table.rows[0] = row; // Replace the first row created by createTable(1)
        model.blocks.push(table);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '12pt' },
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Text',
                                                    text: 'content',
                                                    format: {},
                                                },
                                            ],
                                        },
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '14pt' },
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Selection markers in different table contexts - first marker removed', () => {
        const model = createContentModelDocument();

        // First table
        const table1 = createTable(1);
        const cell1 = createTableCell();
        const row1 = createTableRow();
        const para1 = createParagraph();
        const marker1 = createSelectionMarker({ fontSize: '12pt' });
        const text1 = createText('Table 1');

        para1.segments.push(marker1, text1);
        cell1.blocks.push(para1);
        row1.cells.push(cell1);
        table1.rows[0] = row1;

        // Second table
        const table2 = createTable(1);
        const cell2 = createTableCell();
        const row2 = createTableRow();
        const para2 = createParagraph();
        const marker2 = createSelectionMarker({ fontSize: '14pt' });
        const text2 = createText('Table 2');

        para2.segments.push(marker2, text2);
        cell2.blocks.push(para2);
        row2.cells.push(cell2);
        table2.rows[0] = row2;

        model.blocks.push(table1, table2);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Table 1',
                                                    format: {},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '14pt' },
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Table 2',
                                                    format: {},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Selection markers in paragraph then table - first marker removed', () => {
        const model = createContentModelDocument();

        // Regular paragraph with selection marker
        const para1 = createParagraph();
        const marker1 = createSelectionMarker({ fontWeight: 'bold' });
        const text1 = createText('Regular paragraph');

        para1.segments.push(marker1, text1);

        // Table with selection marker
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para2 = createParagraph();
        const marker2 = createSelectionMarker({ fontSize: '11pt' });
        const text2 = createText('Table content');

        para2.segments.push(marker2, text2);
        cell.blocks.push(para2);
        row.cells.push(cell);
        table.rows[0] = row;

        model.blocks.push(para1, table);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Regular paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '11pt' },
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Table content',
                                                    format: {},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('First selection marker is the only segment in paragraph - marker still removed', () => {
        const model = createContentModelDocument();

        // Paragraph with only selection marker
        const para1 = createParagraph();
        const marker1 = createSelectionMarker({ fontSize: '16pt' });
        para1.segments.push(marker1);

        // Table with selection marker
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para2 = createParagraph();
        const marker2 = createSelectionMarker({ fontSize: '18pt' });
        const text = createText('Table text');

        para2.segments.push(marker2, text);
        cell.blocks.push(para2);
        row.cells.push(cell);
        table.rows[0] = row;

        model.blocks.push(para1, table);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '18pt' },
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Table text',
                                                    format: {},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Complex case with multiple paragraphs and tables', () => {
        const model = createContentModelDocument();

        // First paragraph
        const para1 = createParagraph();
        const marker1 = createSelectionMarker({ fontSize: '10pt' });
        const text1 = createText('First');
        para1.segments.push(marker1, text1);

        // Second paragraph
        const para2 = createParagraph();
        const text2 = createText('Second');
        para2.segments.push(text2);

        // Table with selection marker
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para3 = createParagraph();
        const marker2 = createSelectionMarker({ fontSize: '12pt' });
        const text3 = createText('In table');

        para3.segments.push(marker2, text3);
        cell.blocks.push(para3);
        row.cells.push(cell);
        table.rows[0] = row;

        // Another paragraph
        const para4 = createParagraph();
        const marker3 = createSelectionMarker({ fontSize: '14pt' });
        const text4 = createText('After table');
        para4.segments.push(marker3, text4);

        model.blocks.push(para1, para2, table, para4);

        adjustSelectionForCopyCut(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'First',
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Second',
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,

                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: { fontSize: '12pt' },
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Text',
                                                    text: 'In table',
                                                    format: {},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '14pt' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'After table',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });
});
