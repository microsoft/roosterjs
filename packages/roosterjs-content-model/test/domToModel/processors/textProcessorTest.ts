import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/domToModel/context/DomToModelContext';
import { textProcessor } from '../../../lib/domToModel/processors/textProcessor';

describe('textProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty group', () => {
        const doc = createContentModelDocument(document);
        textProcessor(doc, 'test', context);

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

    it('Group with empty paragraph', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [],
        });

        textProcessor(doc, 'test', context);

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

    it('Group with paragraph with text segment', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test0',
                },
            ],
        });

        textProcessor(doc, 'test1', context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Text,
                            text: 'test0test1',
                        },
                    ],
                },
            ],
            document: document,
        });
    });

    it('Group with paragraph with different type of segment', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.General,
                    blockType: ContentModelBlockType.BlockGroup,
                    blockGroupType: ContentModelBlockGroupType.General,
                    element: null!,
                    blocks: [],
                },
            ],
        });

        textProcessor(doc, 'test', context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.General,
                            blockType: ContentModelBlockType.BlockGroup,
                            blockGroupType: ContentModelBlockGroupType.General,
                            element: null!,
                            blocks: [],
                        },
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

    it('Handle text with selection 1', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                },
            ],
        });

        context.isInSelection = true;

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                },
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test2',
                    isSelected: true,
                },
            ],
        });
    });

    it('Handle text with selection 2', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                    isSelected: true,
                },
            ],
        });

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                    isSelected: true,
                },
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test2',
                },
            ],
        });
    });

    it('Handle text with selection 3', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1',
                    isSelected: true,
                },
            ],
        });

        context.isInSelection = true;

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Text,
                    text: 'test1test2',
                    isSelected: true,
                },
            ],
        });
    });
});
