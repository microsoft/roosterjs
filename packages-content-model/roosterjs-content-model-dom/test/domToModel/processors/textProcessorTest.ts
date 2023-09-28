import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createRange } from 'roosterjs-editor-dom';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { textProcessor } from '../../../lib/domToModel/processors/textProcessor';
import {
    ContentModelDomIndexer,
    ContentModelParagraph,
    ContentModelText,
    DomToModelContext,
} from 'roosterjs-content-model-types';

describe('textProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty group', () => {
        const doc = createContentModelDocument();
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
        });
    });

    it('Group with empty paragraph', () => {
        const doc = createContentModelDocument();
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
        });
    });

    it('Group with paragraph with text segment', () => {
        const doc = createContentModelDocument();
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
                            text: 'test0',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Group with paragraph with different type of segment', () => {
        const doc = createContentModelDocument();
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
        });
    });

    it('Handle text with selection 1', () => {
        const doc = createContentModelDocument();
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
        const doc = createContentModelDocument();
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
        const doc = createContentModelDocument();
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
                    text: 'test1',
                    isSelected: true,
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

    it('Handle text with format', () => {
        const doc = createContentModelDocument();
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

    it('Handle text with link format', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');

        context.link = { format: { href: '/test' }, dataset: {} };

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    link: { format: { href: '/test' }, dataset: {} },
                },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Handle text with selection and link format 1', () => {
        const doc = createContentModelDocument();
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
        context.link = { format: { href: '/test' }, dataset: {} };

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
                    isSelected: true,
                    format: {},
                    link: { format: { href: '/test' }, dataset: {} },
                },
            ],
            format: {},
        });
    });

    it('Handle text with selection and link format 2', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');

        context.link = { format: { href: '/test' }, dataset: {} };
        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                startOffset: 2,
                endContainer: text,
                endOffset: 2,
                collapsed: true,
            } as any,
        };

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [
                {
                    segmentType: 'Text',
                    text: 'te',
                    format: {},
                    link: {
                        format: {
                            href: '/test',
                        },
                        dataset: {},
                    },
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                    link: {
                        format: {
                            href: '/test',
                        },
                        dataset: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'st',
                    format: {},
                    link: { format: { href: '/test' }, dataset: {} },
                },
            ],
            format: {},
        });
    });

    it('Handle text with code format', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');

        context.code = { format: { fontFamily: 'monospace' } };

        textProcessor(doc, text, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    code: { format: { fontFamily: 'monospace' } },
                },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Empty text', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('');

        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('Space only text without existing paragraph', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode(' ');

        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('Space only text with existing paragraph', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode(' ');

        addBlock(doc, createParagraph());
        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Space only text with existing implicit paragraph with existing segment', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode(' ');

        addSegment(doc, createText('test'));
        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: ' ',
                        },
                    ],
                },
            ],
        });
    });

    it('Paragraph with white-space style', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('  \n  ');
        const paragraph = createParagraph(false, {
            whiteSpace: 'pre',
        });

        doc.blocks.push(paragraph);

        textProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        whiteSpace: 'pre',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '  \n  ',
                        },
                    ],
                },
            ],
        });
    });

    it('Empty group with domIndexer', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;

        textProcessor(doc, text, context);

        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [segment],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(text, paragraph, [segment]);
    });

    it('Empty group with domIndexer and collapsed selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;
        context.selection = {
            type: 'range',
            range: createRange(text, 2),
        };

        textProcessor(doc, text, context);

        const segment1: ContentModelText = {
            segmentType: 'Text',
            text: 'te',
            format: {},
        };
        const segment2: ContentModelText = {
            segmentType: 'Text',
            text: 'st',
            format: {},
        };
        const marker = createSelectionMarker();
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [segment1, marker, segment2],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(text, paragraph, [segment1, segment2]);
    });

    it('Empty group with domIndexer and expanded selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;
        context.selection = {
            type: 'range',
            range: createRange(text, 1, text, 3),
        };

        textProcessor(doc, text, context);

        const segment1: ContentModelText = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };
        const segment2: ContentModelText = {
            segmentType: 'Text',
            text: 'es',
            format: {},
            isSelected: true,
        };
        const segment3: ContentModelText = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [segment1, segment2, segment3],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(text, paragraph, [segment1, segment2, segment3]);
    });
});
