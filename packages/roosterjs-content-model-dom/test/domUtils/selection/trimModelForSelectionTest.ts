import { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';
import { trimModelForSelection } from '../../../lib/domUtils/selection/trimModelForSelection';
import {
    createContentModelDocument,
    createImage,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('trimModelForSelection', () => {
    it('should return model for non-collapsed range selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('selected text');
        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        const mockDocument = document.implementation.createHTMLDocument('test');
        const div = mockDocument.createElement('div');
        div.textContent = 'selected text';
        mockDocument.body.appendChild(div);

        const range = mockDocument.createRange();
        range.selectNodeContents(div);

        const selection: DOMSelection = {
            type: 'range',
            range,
            isReverted: false,
        };

        trimModelForSelection(model, selection);

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'selected text',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        };

        expect(model).toEqual(expectedModel);
    });

    it('should return model for table selection', () => {
        const model = createContentModelDocument();
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

        const mockDocument = document.implementation.createHTMLDocument('test');
        const tableElement = mockDocument.createElement('table');
        mockDocument.body.appendChild(tableElement);

        const selection: DOMSelection = {
            type: 'table',
            table: tableElement,
            firstColumn: 0,
            lastColumn: 1,
            firstRow: 0,
            lastRow: 1,
        };

        trimModelForSelection(model, selection);

        const expectedModel: ContentModelDocument = {
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
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Cell 0,0',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Cell 0,1',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
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
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Cell 1,0',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Cell 1,1',
                                                    format: {},
                                                    isSelected: true,
                                                },
                                            ],
                                        },
                                    ],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
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
        };

        expect(model).toEqual(expectedModel);
    });

    it('should return model for image selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const imageSelected = createImage('www.test.com');
        para.segments.push(imageSelected);
        imageSelected.isSelected = true;
        const marker = createSelectionMarker();
        marker.isSelected = true;
        para.segments.push(marker);
        model.blocks.push(para);

        const mockDocument = document.implementation.createHTMLDocument('test');
        const img = mockDocument.createElement('img');
        mockDocument.body.appendChild(img);
        const range = document.createRange();
        range.selectNode(img);

        const selection: DOMSelection = {
            type: 'range',
            range,
            isReverted: false,
        };

        trimModelForSelection(model, selection);

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'www.test.com',
                            dataset: {},
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        };

        expect(model).toEqual(expectedModel);
    });

    it('should prune unselected content from model', () => {
        const model = createContentModelDocument();

        // Add selected paragraph
        const selectedPara = createParagraph();
        const selectedText = createText('selected');
        selectedText.isSelected = true;
        selectedPara.segments.push(selectedText);

        // Add unselected paragraph
        const unselectedPara = createParagraph();
        const unselectedText = createText('unselected');
        unselectedPara.segments.push(unselectedText);

        model.blocks.push(selectedPara, unselectedPara);

        const mockDocument = document.implementation.createHTMLDocument('test');
        const div = mockDocument.createElement('div');
        div.textContent = 'selected';
        mockDocument.body.appendChild(div);

        const range = mockDocument.createRange();
        range.selectNodeContents(div);

        const selection: DOMSelection = {
            type: 'range',
            range,
            isReverted: false,
        };

        trimModelForSelection(model, selection);

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'selected',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        };

        expect(model).toEqual(expectedModel);
    });
});
