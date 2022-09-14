import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeTable } from '../../../lib/modelApi/table/normalizeTable';

describe('normalizeTable', () => {
    it('Normalize an empty table', () => {
        const table = createTable(0);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [],
            heights: [],
        });
    });

    it('Normalize a table without content', () => {
        const table = createTable(1);

        table.cells[0].push(createTableCell(1, 1, false));

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120],
            heights: [22],
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

        table.cells[0].push(cell1);
        table.cells[1].push(cell2);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
                    },
                ],
                [
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120],
            heights: [22, 22],
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

        table.cells[0].push(cell1);
        table.cells[0].push(cell2);
        table.cells[0].push(cell3);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240, 120],
            heights: [22],
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

        table.cells[0].push(cell1);
        table.cells[0].push(cell2);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240],
            heights: [22],
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

        table.cells[0].push(cell1);
        table.cells[0].push(cell2);
        table.cells[1].push(cell3);
        table.cells[1].push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
                    {
                        blockGroupType: 'TableCell',
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        format: { useBorderBox: true },
                        blocks: [block1, block2],
                    },
                    {
                        blockGroupType: 'TableCell',
                        spanLeft: true,
                        spanAbove: false,
                        isHeader: false,
                        format: { useBorderBox: true },
                        blocks: [],
                    },
                ],
                [
                    {
                        blockGroupType: 'TableCell',
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        format: { useBorderBox: true },
                        blocks: [block3],
                    },
                    {
                        blockGroupType: 'TableCell',
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        format: { useBorderBox: true },
                        blocks: [block4],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120, 120],
            heights: [22, 22],
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

        table.cells[0].push(cell1);
        table.cells[0].push(cell2);
        table.cells[1].push(cell3);
        table.cells[1].push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [120, 120],
            heights: [44],
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

        table.cells[0].push(cell1);
        table.cells[0].push(cell2);
        table.cells[1].push(cell3);
        table.cells[1].push(cell4);

        normalizeTable(table);

        expect(table).toEqual({
            blockType: 'Table',
            cells: [
                [
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
                            },
                        ],
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
            widths: [240],
            heights: [44],
        });
    });
});
