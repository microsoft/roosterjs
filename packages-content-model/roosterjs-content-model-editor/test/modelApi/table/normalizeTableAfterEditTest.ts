import { ContentModelParagraph } from 'roosterjs-content-model-types';
import { normalizeTableAfterEdit } from '../../../lib/modelApi/table/normalizeTableAfterEdit';
import {
    createContentModelDocument,
    createDivider,
    createFormatContainer,
    createParagraph,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';

describe('normalizeTableAfterEdit', () => {
    it('Table has cell with paragraph', () => {
        const table = createTable(1);
        const cell = createTableCell();
        const paragraph = createParagraph();
        const model = createContentModelDocument();

        cell.blocks.push(paragraph);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        const result = normalizeTableAfterEdit(model, [model], table);

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

        const result = normalizeTableAfterEdit(model, [model], table);

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

        const result = normalizeTableAfterEdit(model, [model], table);

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

        const result = normalizeTableAfterEdit(model, [model], table);

        console.log(JSON.stringify(model));

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
});
