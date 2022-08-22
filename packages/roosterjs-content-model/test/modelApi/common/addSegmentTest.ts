import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('addSegment', () => {
    it('Add segment to empty document', () => {
        const doc = createContentModelDocument(document);
        const segment = createText('test');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test',
                        },
                    ],
                },
            ],
            document: document,
        });
    });

    it('Add segment to document contains an empty paragraph', () => {
        const doc = createContentModelDocument(document);
        addBlock(doc, createParagraph(false));

        const segment = createText('test');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test',
                        },
                    ],
                },
            ],
            document: document,
        });
    });

    it('Add segment to document contains a paragraph with existing text', () => {
        const doc = createContentModelDocument(document);
        const block: ContentModelParagraph = {
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                },
            ],
        };
        addBlock(doc, block);

        const segment = createText('test2');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test1',
                        },
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test2',
                        },
                    ],
                },
            ],
            document: document,
        });
    });

    it('Add segment to document contains a paragraph with other type of block', () => {
        const doc = createContentModelDocument(document);
        const div = document.createElement('div');
        const block: ContentModelGeneralBlock = {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: div,
        };
        addBlock(doc, block);

        const segment = createText('test');

        addSegment(doc, segment);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                block,
                {
                    blockType: ContentModelBlockType.Paragraph,
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test',
                        },
                    ],
                },
            ],
            document: document,
        });
    });
});
