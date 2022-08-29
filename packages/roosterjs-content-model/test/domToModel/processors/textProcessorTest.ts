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
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
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
            blockType: 'Paragraph',
            segments: [],
        });

        textProcessor(doc, 'test', context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
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
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test0',
                },
            ],
        });

        textProcessor(doc, 'test1', context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
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
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'General',
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    element: null!,
                    blocks: [],
                },
            ],
        });

        textProcessor(doc, 'test', context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'General',
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            element: null!,
                            blocks: [],
                        },
                        {
                            segmentType: 'Text',
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
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                },
            ],
        });

        context.isInSelection = true;

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    isSelected: true,
                },
            ],
        });
    });

    it('Handle text with selection 2', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                },
            ],
        });

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                },
            ],
        });
    });

    it('Handle text with selection 3', () => {
        const doc = createContentModelDocument(document);
        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                },
            ],
        });

        context.isInSelection = true;

        textProcessor(doc, 'test2', context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1test2',
                    isSelected: true,
                },
            ],
        });
    });
});
