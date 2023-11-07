import { ContentModelSelectionMarker } from 'roosterjs-content-model-types';
import { DeletedEntity } from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import { deleteSelection } from '../../../lib/publicApi/selection/deleteSelection';
import {
    createContentModelDocument,
    createDivider,
    createEntity,
    createGeneralBlock,
    createGeneralSegment,
    createImage,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('deleteSelection - selectionOnly', () => {
    it('empty selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result.deleteResult).toBe('notDeleted');
        expect(result.insertPoint).toBeNull();
    });

    it('Single selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });

        para.segments.push(marker);
        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('notDeleted');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test1', { fontSize: '10px' });

        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple text selection in multiple paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text0 = createText('test0', { fontSize: '10px' });
        const text1 = createText('test1', { fontSize: '11px' });
        const text2 = createText('test2', { fontSize: '12px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text0);
        para1.segments.push(text1);
        para2.segments.push(text2);

        model.blocks.push(para1);
        model.blocks.push(para2);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '11px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0',
                            format: { fontSize: '10px' },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '11px' },
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
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
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('2 Divider selection and paragraph after it', () => {
        const model = createContentModelDocument();
        const divider1 = createDivider('div');
        const divider2 = createDivider('hr');
        const para1 = createParagraph();
        const para2 = createParagraph();

        divider1.isSelected = true;
        divider2.isSelected = true;
        model.blocks.push(para1, divider1, divider2, para2);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
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
                    ],
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Some table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();

        cell2.isSelected = true;

        table.rows[0].cells.push(cell1, cell2);
        model.blocks.push(table);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                isImplicit: false,
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: [cell2, model],
            tableContext: {
                table: table,
                colIndex: 1,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
        });

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
                                    blocks: [],
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            isImplicit: false,
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
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
                },
            ],
        });
    });

    it('All table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();

        cell.isSelected = true;

        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

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
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('Entity selection, no callback', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper);
        model.blocks.push(entity);

        entity.isSelected = true;

        const result = deleteSelection(model);

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

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
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('Entity selection, callback returns false', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper);
        const deletedEntities: DeletedEntity[] = [];
        model.blocks.push(entity);

        entity.isSelected = true;

        const result = deleteSelection(model, [], {
            newEntities: [],
            deletedEntities,
            newImages: [],
        });

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

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
                    ],
                    isImplicit: false,
                },
            ],
        });

        expect(deletedEntities).toEqual([{ entity, operation: 'overwrite' }]);
    });

    it('Entity selection, callback returns true', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper);
        model.blocks.push(entity);

        entity.isSelected = true;

        const deletedEntities: DeletedEntity[] = [];
        const result = deleteSelection(model, [], {
            newEntities: [],
            deletedEntities,
            newImages: [],
        });

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
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
                    format: {},
                    isImplicit: false,
                },
            ],
        });

        expect(deletedEntities).toEqual([{ entity, operation: 'overwrite' }]);
    });

    it('delete with default format', () => {
        const model = createContentModelDocument({
            fontSize: '10pt',
        });
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: { fontSize: '10pt' },
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
                segmentFormat: { fontSize: '10pt' },
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                    segmentFormat: { fontSize: '10pt' },
                },
            ],
            format: { fontSize: '10pt' },
        });
    });

    it('delete with general block', () => {
        const model = createContentModelDocument();
        const general = createGeneralBlock(null!);

        general.isSelected = true;
        model.blocks.push(general);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
            ],
        });
    });

    it('delete with general block and others', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');
        const general = createGeneralBlock(null!);

        divider.isSelected = true;
        general.isSelected = true;
        model.blocks.push(divider, general);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('delete with general segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const general = createGeneralSegment(null!);

        general.isSelected = true;
        para.segments.push(general);
        model.blocks.push(para);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                },
            ],
        });
    });

    it('delete with general segment and others', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const general = createGeneralSegment(null!);
        const text = createText('test');

        general.isSelected = true;
        text.isSelected = true;
        para.segments.push(general, text);
        model.blocks.push(para);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                },
            ],
        });
    });

    it('Normalize spaces before deleted segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test ');
        const image = createImage('test');

        image.isSelected = true;
        para.segments.push(text, image);
        model.blocks.push(para);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [{ segmentType: 'Text', text: 'test\u00A0', format: {} }, marker],
                format: {},
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [{ segmentType: 'Text', text: 'test\u00A0', format: {} }, marker],
                },
            ],
        });
    });

    it('Make paragraph not implicit when delete', () => {
        const model = createContentModelDocument();
        const para = createParagraph(true /*isImplicit*/);
        const text = createText('test ');

        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
            ],
        });
    });

    it('Delete divider with default format', () => {
        const model = createContentModelDocument({ fontFamily: 'Arial' });
        const divider = createDivider('hr');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: { fontFamily: 'Arial' },
            isSelected: true,
        };

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
                segmentFormat: { fontFamily: 'Arial' },
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                    segmentFormat: { fontFamily: 'Arial' },
                },
            ],
            format: { fontFamily: 'Arial' },
        });
    });
});
