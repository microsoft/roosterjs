import { ContentModelParagraph } from 'roosterjs-content-model-types';
import { ensureFocusableParagraphForTable } from '../../../lib/modelApi/table/ensureFocusableParagraphForTable';
import {
    createContentModelDocument,
    createDivider,
    createFormatContainer,
    createParagraph,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';

describe('ensureFocusableParagraphForTable', () => {
    it('Table has cell with paragraph', () => {
        const table = createTable(1);
        const cell = createTableCell();
        const paragraph = createParagraph();
        const model = createContentModelDocument();

        cell.blocks.push(paragraph);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        const result = ensureFocusableParagraphForTable(model, [model], table);

        expect(model).toEqual({
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
                                    blocks: [paragraph],
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
        expect(result).toBe(paragraph);
    });

    it('Table has cell without paragraph', () => {
        const table = createTable(1);
        const cell = createTableCell();
        const divider = createDivider('div');
        const model = createContentModelDocument();

        cell.blocks.push(divider);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        const result = ensureFocusableParagraphForTable(model, [model], table);

        expect(model).toEqual({
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
                                        divider,
                                        {
                                            blockType: 'Paragraph',
                                            segments: [{ segmentType: 'Br', format: {} }],
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
        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [{ segmentType: 'Br', format: {} }],
            format: {},
        });
    });

    it('Table has no cell', () => {
        const table = createTable(0);
        const model = createContentModelDocument();

        model.blocks.push(table);

        const result = ensureFocusableParagraphForTable(model, [model], table);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
        });
        expect(result).toBe(model.blocks[0] as ContentModelParagraph);
    });

    it('Table has no cell, parent is format container', () => {
        const table = createTable(0);
        const container = createFormatContainer('div');
        const model = createContentModelDocument();

        container.blocks.push(table);
        model.blocks.push(container);

        const result = ensureFocusableParagraphForTable(model, [container, model], table);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
        });
        expect(result).toBe(model.blocks[0] as ContentModelParagraph);
    });

    it('Table has no cell, parent is format container, and has other block', () => {
        const table = createTable(0);
        const paragraph = createParagraph();
        const container = createFormatContainer('div');
        const model = createContentModelDocument();

        container.blocks.push(paragraph);
        container.blocks.push(table);
        model.blocks.push(container);

        const result = ensureFocusableParagraphForTable(model, [container, model], table);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    blocks: [
                        { blockType: 'Paragraph', segments: [], format: {} },
                        {
                            blockType: 'Paragraph',
                            segments: [{ segmentType: 'Br', format: {} }],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(result).toBe(container.blocks[1] as ContentModelParagraph);
    });

    it('Table has no cell, parent is format container in another container', () => {
        const table = createTable(0);
        const container1 = createFormatContainer('div');
        const container2 = createFormatContainer('div');
        const para1 = createParagraph();
        const para2 = createParagraph();
        const model = createContentModelDocument();

        container1.blocks.push(table);
        container2.blocks.push(container1);
        model.blocks.push(para1);
        model.blocks.push(container2);
        model.blocks.push(para2);

        const result = ensureFocusableParagraphForTable(
            model,
            [container1, container2, model],
            table
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                { blockType: 'Paragraph', segments: [], format: {} },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
                { blockType: 'Paragraph', segments: [], format: {} },
            ],
        });
        expect(result).toBe(model.blocks[1] as ContentModelParagraph);
    });
});
