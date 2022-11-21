import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/group/ContentModelGeneralBlock';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('addSegment', () => {
    it('Add segment to empty document', () => {
        const doc = createContentModelDocument();
        const segment = createText('test');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
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

    it('Add segment to document contains an empty paragraph', () => {
        const doc = createContentModelDocument();
        addBlock(doc, createParagraph(false));

        const segment = createText('test');

        addSegment(doc, segment);

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
    });

    it('Add segment to document contains a paragraph with existing text', () => {
        const doc = createContentModelDocument();
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
        const doc = createContentModelDocument();
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
});
