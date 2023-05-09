import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { setSelection } from '../../../lib/modelApi/selection/setSelection';

describe('setSelection', () => {
    it('Empty model, empty selection', () => {
        const model = createContentModelDocument();
        setSelection(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Empty model, incorrect selection', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();
        setSelection(model, marker);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Empty model, incorrect selection 2', () => {
        const model = createContentModelDocument();
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        setSelection(model, marker1, marker2);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Model without selection, set to segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        setSelection(model, text2);
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
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Model without selection, set to segment range', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');

        para.segments.push(text1, text2, text3, text4, text5);
        model.blocks.push(para);

        setSelection(model, text2, text4);
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
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test4',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test5',
                        },
                    ],
                },
            ],
        });
    });

    it('Model without selection, set to segment range in multiple blocks', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const text5 = createText('test5');

        para1.segments.push(text1, text2);
        para2.segments.push(text3);
        para3.segments.push(text4, text5);

        model.blocks.push(para1, para2, para3);

        setSelection(model, text2, text4);
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
                            isSelected: true,
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
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test4',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test5',
                        },
                    ],
                },
            ],
        });
    });

    it('Model with selection, set to different selection', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        para1.segments.push(text1, text2, text3);

        model.blocks.push(para1);

        setSelection(model, text3);
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
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Model with selection to selection marker, set to different selection', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(marker, text1, text2);

        model.blocks.push(para1);

        setSelection(model, text2);
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
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Model with selection to selection marker, set to a selection that cover existing selection', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);

        model.blocks.push(para1);

        setSelection(model, text1, text2);
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
    });

    it('Model without selection, set to a table cell', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);

        model.blocks.push(table);

        setSelection(model, cell);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
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
                                    blocks: [],
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                    widths: [],
                },
            ],
        });
    });

    it('Model without selection, set to a range of table cells', () => {
        const model = createContentModelDocument();
        const table = createTable(2);
        const cell11 = createTableCell();
        const cell12 = createTableCell();
        const cell21 = createTableCell();
        const cell22 = createTableCell();

        table.rows[0].cells.push(cell11, cell12);
        table.rows[1].cells.push(cell21, cell22);

        model.blocks.push(table);

        setSelection(model, cell11, cell21);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
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
                                    blocks: [],
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    blocks: [],
                                    isHeader: false,
                                },
                            ],
                        },
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
                                    blocks: [],
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    dataset: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    blocks: [],
                                    isHeader: false,
                                },
                            ],
                        },
                    ],
                    widths: [],
                },
            ],
        });
    });

    it('Model without selection, set to a mixed table selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        cell.blocks.push(para2);
        table.rows[0].cells.push(cell);

        model.blocks.push(para1, table, para3);

        setSelection(model, text1, cell);
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
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
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
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    format: {},
                                                    text: 'test2',
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                    isHeader: false,
                                },
                            ],
                        },
                    ],
                    widths: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Set selection to divider', () => {
        const model = createContentModelDocument();
        const divider = createDivider('hr');

        model.blocks.push(divider);
        setSelection(model, divider);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    format: {},
                    tagName: 'hr',
                    isSelected: true,
                },
            ],
        });
    });

    it('Set selection to image', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const image = createImage('');

        para.segments.push(image);
        model.blocks.push(para);
        setSelection(model, image);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: '',
                            dataset: {},
                            isSelected: true,
                            isSelectedAsImageSelection: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Set selection to image and others', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const image = createImage('');
        const text = createText('test');

        para.segments.push(image, text);
        model.blocks.push(para);
        setSelection(model, image, text);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: '',
                            dataset: {},
                            isSelected: true,
                            isSelectedAsImageSelection: false,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Set selection to general segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const span = document.createElement('span');
        const generalSpan = createGeneralSegment(span);

        para.segments.push(generalSpan);
        model.blocks.push(para);
        setSelection(model, generalSpan);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            blockGroupType: 'General',
                            blockType: 'BlockGroup',
                            segmentType: 'General',
                            element: span,
                            format: {},
                            isSelected: true,
                            blocks: [],
                        },
                    ],
                },
            ],
        });
    });

    it('Set selection to model under general segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const span = document.createElement('span');
        const generalSpan = createGeneralSegment(span);
        const divider = createDivider('div');

        generalSpan.blocks.push(divider);
        para.segments.push(generalSpan);
        model.blocks.push(para);

        setSelection(model, divider);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            blockGroupType: 'General',
                            blockType: 'BlockGroup',
                            segmentType: 'General',
                            element: span,
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Divider',
                                    tagName: 'div',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Clear selection under general segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const span = document.createElement('span');
        const generalSpan = createGeneralSegment(span);
        const divider = createDivider('div');

        divider.isSelected = true;

        generalSpan.blocks.push(divider);
        para.segments.push(generalSpan);
        model.blocks.push(para);

        setSelection(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            blockGroupType: 'General',
                            blockType: 'BlockGroup',
                            segmentType: 'General',
                            element: span,
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Divider',
                                    tagName: 'div',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
