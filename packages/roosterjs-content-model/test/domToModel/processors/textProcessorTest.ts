import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { textProcessor } from '../../../lib/domToModel/processors/textProcessor';

describe('textProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty group', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test');

        textProcessor(doc, text, context);

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
            document: document,
        });
    });

    it('Group with empty paragraph', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test');
        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [],
            format: {},
        });

        textProcessor(doc, text, context);

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
            document: document,
        });
    });

    it('Group with paragraph with text segment', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test1');

        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test0',
                    format: {},
                },
            ],
            format: {},
        });

        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0test1',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            document: document,
        });
    });

    it('Group with paragraph with different type of segment', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test');

        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'General',
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    element: null!,
                    blocks: [],
                    format: {},
                },
            ],
            format: {},
        });

        textProcessor(doc, text, context);

        expect(doc).toEqual({
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
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            document: document,
        });
    });

    it('Handle text with selection 1', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test2');

        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
            ],
            format: {},
        });

        context.isInSelection = true;

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
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
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('Handle text with selection 2', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test2');

        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        });

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('Handle text with selection 3', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test2');

        doc.blocks.push({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        });

        context.isInSelection = true;

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1test2',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('Handle text with format', () => {
        const doc = createContentModelDocument(document);
        const text = document.createTextNode('test');

        context.segmentFormat = { a: 'b' } as any;

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: { a: 'b' } as any,
                },
            ],
            isImplicit: true,
            format: {},
        });
    });
});
