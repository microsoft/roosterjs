import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import {
    ContentModelGeneralBlock,
    ContentModelParagraph,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

describe('addSegment', () => {
    it('Add segment to empty document', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const segment = createText('test');
        const result = addSegment(doc, segment);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                },
            ],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(result).toEqual(paragraph);
    });

    it('Add segment to document contains an empty paragraph', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph(false);
        addBlock(doc, para);

        const segment = createText('test');

        const result = addSegment(doc, segment);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(result).toBe(para);
    });

    it('Add segment to document contains a paragraph with existing text', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const block: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
            ],
            format: {},
        };
        addBlock(doc, block);

        const segment = createText('test2');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add segment to document contains a paragraph with other type of block', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const div = document.createElement('div');
        const block: ContentModelGeneralBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: div,
            format: {},
        };
        addBlock(doc, block);

        const segment = createText('test');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                block,
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selection marker in empty paragraph', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();

        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontFamily: 'Arial' },
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selection marker after selection marker', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selection marker after selected segment', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();

        br.isSelected = true;
        para.segments.push(br);
        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selection marker after selection marker', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selection marker after selection marker that is not selected', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        marker.isSelected = false;
        para.segments.push(marker);
        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontFamily: 'Arial' },
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add unselected selection marker after selection marker', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        doc.blocks.push(para);

        const newMarker = createSelectionMarker({ fontFamily: 'Arial' });

        newMarker.isSelected = false;

        addSegment(doc, newMarker);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontFamily: 'Arial' },
                            isSelected: false,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selected segment after selection marker', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        doc.blocks.push(para);

        const br = createBr({ fontFamily: 'Arial' });

        br.isSelected = true;

        addSegment(doc, br);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: { fontFamily: 'Arial' },
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Add selected segment after unselected selection marker', () => {
        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        marker.isSelected = false;
        para.segments.push(marker);
        doc.blocks.push(para);

        const br = createBr({ fontFamily: 'Arial' });

        br.isSelected = true;

        addSegment(doc, br);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        {
                            segmentType: 'Br',
                            format: { fontFamily: 'Arial' },
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
