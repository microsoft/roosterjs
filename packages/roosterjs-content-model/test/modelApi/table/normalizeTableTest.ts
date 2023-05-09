import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { ContentModelTableFormat } from '../../../lib/publicTypes/format/ContentModelTableFormat';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createTable as originalCreateTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell as originalCreateTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeTable } from '../../../lib/modelApi/table/normalizeTable';

const mockedCachedElement = {} as any;

function createTable(rowCount: number, format?: ContentModelTableFormat): ContentModelTable {
    const table = originalCreateTable(rowCount, format);

    table.cachedElement = mockedCachedElement;

    return table;
}

function createTableCell(
    spanLeftOrColSpan?: boolean | number,
    spanAboveOrRowSpan?: boolean | number,
    isHeader?: boolean,
    format?: ContentModelTableCellFormat
) {
    const cell = originalCreateTableCell(spanLeftOrColSpan, spanAboveOrRowSpan, isHeader, format);

    cell.cachedElement = mockedCachedElement;

    return cell;
}

describe('normalizeTable', () => {
    it('Normalize an empty table', () => {
        const table = createTable(0);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table without content', () => {
        const table = createTable(1);

        table.rows[0].cells.push(createTableCell(1, 1, false));

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    isImplicit: true,
                                    segments: [
                                        {
                                            segmentType: 'Br',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with TH in middle spanLeft/spanAbove in border cells', () => {
        const table = createTable(2);

        const cell1 = createTableCell(2, 2, false);
        const cell2 = createTableCell(1, 1, true);

        const block1 = createParagraph();
        const block2 = createParagraph();

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);

        table.rows[0].cells.push(cell1);
        table.rows[1].cells.push(cell2);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [],
                                    format: {},
                                },
                            ],
                            dataset: {},
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with left-spanned cells', () => {
        const table = createTable(1);

        const cell1 = createTableCell(1, 1, false);
        const cell2 = createTableCell(2, 1, false);
        const cell3 = createTableCell(1, 1, false);

        const block1 = createParagraph();
        const block2 = createParagraph();
        const block3 = createParagraph();

        const text1 = createText('text1');
        const text2 = createText('text2');
        const text3 = createText('text3');

        block1.segments.push(text1);
        block2.segments.push(text2);
        block3.segments.push(text3);

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);
        cell3.blocks.push(block3);

        table.rows[0].cells.push(cell1);
        table.rows[0].cells.push(cell2);
        table.rows[0].cells.push(cell3);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text1',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text2',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text3',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240, 120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with left-spanned cells with BR inside', () => {
        const table = createTable(1);

        const cell1 = createTableCell(1, 1, false);
        const cell2 = createTableCell(2, 1, false);

        const block1 = createParagraph();
        const block2 = createParagraph();

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);

        table.rows[0].cells.push(cell1);
        table.rows[0].cells.push(cell2);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with mixed left-spanned cells', () => {
        const table = createTable(2);

        const cell1 = createTableCell(1, 1, false);
        const cell2 = createTableCell(2, 1, false);
        const cell3 = createTableCell(1, 1, false);
        const cell4 = createTableCell(1, 1, false);

        const block1 = createParagraph();
        const block2 = createParagraph();
        const block3 = createParagraph();
        const block4 = createParagraph();

        block1.segments.push(createText('text1'));
        block2.segments.push(createText('text2'));
        block3.segments.push(createText('text3'));
        block4.segments.push(createText('text4'));

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);
        cell3.blocks.push(block3);
        cell4.blocks.push(block4);

        table.rows[0].cells.push(cell1);
        table.rows[0].cells.push(cell2);
        table.rows[1].cells.push(cell3);
        table.rows[1].cells.push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block1, block2],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: true,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block3],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block4],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120, 120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with mixed above-spanned cells', () => {
        const table = createTable(2);

        const cell1 = createTableCell(1, 1, false);
        const cell2 = createTableCell(1, 1, false);
        const cell3 = createTableCell(1, 2, false);
        const cell4 = createTableCell(1, 2, false);

        const block1 = createParagraph();
        const block2 = createParagraph();
        const block3 = createParagraph();
        const block4 = createParagraph();

        block1.segments.push(createText('text1'));
        block2.segments.push(createText('text2'));
        block3.segments.push(createText('text3'));
        block4.segments.push(createText('text4'));

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);
        cell3.blocks.push(block3);
        cell4.blocks.push(block4);

        table.rows[0].cells.push(cell1);
        table.rows[0].cells.push(cell2);
        table.rows[1].cells.push(cell3);
        table.rows[1].cells.push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 44,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text1',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text3',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text2',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text4',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120, 120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with mixed both-spanned cells', () => {
        const table = createTable(2);

        const cell1 = createTableCell(1, 1, false);
        const cell2 = createTableCell(2, 1, false);
        const cell3 = createTableCell(1, 2, false);
        const cell4 = createTableCell(2, 2, false);

        const block1 = createParagraph();
        const block2 = createParagraph();
        const block3 = createParagraph();
        const block4 = createParagraph();

        block1.segments.push(createText('text1'));
        block2.segments.push(createText('text2'));
        block3.segments.push(createText('text3'));
        block4.segments.push(createText('text4'));

        cell1.blocks.push(block1);
        cell2.blocks.push(block2);
        cell3.blocks.push(block3);
        cell4.blocks.push(block4);

        table.rows[0].cells.push(cell1);
        table.rows[0].cells.push(cell2);
        table.rows[1].cells.push(cell3);
        table.rows[1].cells.push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 44,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            dataset: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text1',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text2',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text3',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text4',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table with format', () => {
        const table = createTable(1);
        const format: ContentModelSegmentFormat = {
            fontSize: '10px',
        };

        table.rows[0].cells.push(createTableCell(1, 1, false));

        normalizeTable(table, format);

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 22,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    isImplicit: true,
                                    segments: [
                                        {
                                            segmentType: 'Br',
                                            format: {
                                                fontSize: '10px',
                                            },
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });

    it('Normalize a table that does not need normalization at all', () => {
        const table = createTable(2, {
            useBorderBox: true,
            borderCollapse: true,
        });

        table.rows[0].cells.push(createTableCell(1, 1, false, { useBorderBox: true }));
        table.rows[0].cells.push(createTableCell(1, 1, false, { useBorderBox: true }));
        table.rows[1].cells.push(createTableCell(1, 1, false, { useBorderBox: true }));
        table.rows[1].cells.push(createTableCell(1, 1, false, { useBorderBox: true }));

        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        normalizeTable(table);

        const block: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        };

        expect(table).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
                {
                    format: {},
                    height: 200,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            format: { useBorderBox: true },
                            blocks: [block],
                            dataset: {},
                            cachedElement: mockedCachedElement,
                        },
                    ],
                },
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
    });
});
