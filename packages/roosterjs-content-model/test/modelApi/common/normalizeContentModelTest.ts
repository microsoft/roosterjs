import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeContentModel } from '../../../lib/modelApi/common/normalizeContentModel';

describe('normalizeContentModel', () => {
    it('Empty model', () => {
        const model = createContentModelDocument();

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove empty paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('');

        para.segments.push(text);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove empty segment from paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('');
        const text3 = createText('test2');

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        normalizeContentModel(model);

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
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
            ],
        });
    });

    it('Normalize paragraph', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');
        const br = createBr();

        para1.segments.push(marker);
        para2.segments.push(text, br);
        model.blocks.push(para1, para2);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
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
                            format: {},
                            text: 'test',
                        },
                    ],
                },
            ],
        });
    });

    it('Normalize paragraph with multiple BRs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const br1 = createBr();
        const marker = createSelectionMarker();
        const br2 = createBr();
        const br3 = createBr();
        const br4 = createBr();

        para1.segments.push(br1, marker, br2);
        para2.segments.push(br3, br4);
        model.blocks.push(para1, para2);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Do not normalize implicit paragraph', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(true /*isImplicit*/);
        const para2 = createParagraph(true /*isImplicit*/);
        const marker = createSelectionMarker();
        const text = createText('test');
        const br = createBr();

        para1.segments.push(marker);
        para2.segments.push(text, br);
        model.blocks.push(para1, para2);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Normalize table cell', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const text = createText('');

        para.segments.push(text);
        cell.blocks.push(para);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    widths: [],
                    dataset: {},
                },
            ],
        });
    });

    it('Normalize list item without level', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([]);
        const para = createParagraph(true /*isImplicit*/);
        const text = createText('test');

        para.segments.push(text);
        listItem.blocks.push(para);
        model.blocks.push(listItem);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text],
                    format: {},
                    isImplicit: false,
                },
            ],
        });
    });
});
