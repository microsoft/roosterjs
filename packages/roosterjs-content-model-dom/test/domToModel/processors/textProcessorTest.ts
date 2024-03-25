import * as addSelectionMarker from '../../../lib/domToModel/utils/addSelectionMarker';
import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createRange } from '../../testUtils';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { textProcessor } from '../../../lib/domToModel/processors/textProcessor';
import {
    DomIndexer,
    ContentModelParagraph,
    ContentModelText,
    DomToModelContext,
    ContentModelSegment,
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
            isReverted: false,
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
        const domIndexer: DomIndexer = {
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
        const domIndexer: DomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;
        context.selection = {
            type: 'range',
            range: createRange(text, 2),
            isReverted: false,
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
        const domIndexer: DomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;
        context.selection = {
            type: 'range',
            range: createRange(text, 1, text, 3),
            isReverted: false,
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

    it('process with text format parser', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test1');
        const parserSpy = jasmine.createSpy('parser');

        context.formatParsers.text = [parserSpy];

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
                            text: 'test1',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(parserSpy).toHaveBeenCalledTimes(1);
        expect(parserSpy).toHaveBeenCalledWith({}, text, context);
    });

    it('With pending format, match collapsed selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const addSelectionMarkerSpy = spyOn(
            addSelectionMarker,
            'addSelectionMarker'
        ).and.callThrough();

        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                endContainer: text,
                startOffset: 2,
                endOffset: 2,
            } as any,
            isReverted: false,
        };
        context.pendingFormat = {
            format: {
                a: 'a',
            } as any,
            posContainer: text,
            posOffset: 2,
        };

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
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { a: 'a' } as any,
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(addSelectionMarkerSpy).toHaveBeenCalledTimes(2);
        expect(addSelectionMarkerSpy).toHaveBeenCalledWith(doc, context, text, 2);
    });

    it('With pending format, match expanded selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const addSelectionMarkerSpy = spyOn(
            addSelectionMarker,
            'addSelectionMarker'
        ).and.callThrough();

        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                endContainer: text,
                startOffset: 1,
                endOffset: 3,
            } as any,
            isReverted: false,
        };
        context.pendingFormat = {
            format: {
                a: 'a',
            } as any,
            posContainer: text,
            posOffset: 3,
        };

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
                            text: 't',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'es',
                            format: {} as any,
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(addSelectionMarkerSpy).toHaveBeenCalledTimes(2);
        expect(addSelectionMarkerSpy).toHaveBeenCalledWith(doc, context, text, 1);
        expect(addSelectionMarkerSpy).toHaveBeenCalledWith(doc, context, text, 3);
    });

    it('With pending format, not match selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const addSelectionMarkerSpy = spyOn(
            addSelectionMarker,
            'addSelectionMarker'
        ).and.callThrough();

        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                endContainer: text,
                startOffset: 2,
                endOffset: 2,
            } as any,
            isReverted: false,
        };
        context.pendingFormat = {
            format: {
                a: 'a',
            } as any,
            posContainer: text,
            posOffset: 3,
        };

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
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(addSelectionMarkerSpy).toHaveBeenCalledTimes(2);
        expect(addSelectionMarkerSpy).toHaveBeenCalledWith(doc, context, text, 2);
    });
});

describe('textProcessor with shadow insert point', () => {
    const inputText = 'abcdef';

    beforeEach(() => {});

    function runTest(
        startOffset: number,
        endOffset: number,
        shadowOffset: number,
        result: string[],
        inSelectionResult: boolean,
        alreadyInSelection?: boolean
    ) {
        const text = document.createTextNode(inputText);
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                startOffset,
                endContainer: text,
                endOffset,
            } as any,
            isReverted: false,
        };

        if (alreadyInSelection) {
            context.isInSelection = true;
        }

        context.shadowInsertPoint = {
            input: {
                node: text,
                offset: shadowOffset,
            },
        };

        textProcessor(group, text, context);

        const actualResult = (group.blocks[0] as ContentModelParagraph).segments.map(translate);

        expect(actualResult).toEqual(result);
        expect(context.isInSelection).toBe(inSelectionResult);
    }

    describe('no selection', () => {
        it('No selection', () => {
            runTest(-1, -1, -1, ['abcdef'], false);
            runTest(-1, -1, 0, ['_', 'abcdef'], false);
            runTest(-1, -1, 3, ['abc', '_', 'def'], false);
            runTest(-1, -1, 6, ['abcdef', '_'], false);
        });

        it('No selection, but in selection', () => {
            runTest(-1, -1, -1, ['*abcdef'], true, true);
            runTest(-1, -1, 0, ['_', '*abcdef'], true, true);
            runTest(-1, -1, 3, ['*abc', '_', '*def'], true, true);
            runTest(-1, -1, 6, ['*abcdef', '_'], true, true);
        });
    });

    describe('Has start', () => {
        it('start at 0', () => {
            runTest(0, -1, -1, ['*abcdef'], true);
            runTest(0, -1, 0, ['_', '*abcdef'], true);
            runTest(0, -1, 3, ['*abc', '_', '*def'], true);
            runTest(0, -1, 6, ['*abcdef', '_'], true);
        });

        it('start at middle', () => {
            runTest(2, -1, -1, ['ab', '*cdef'], true);
            runTest(2, -1, 0, ['_', 'ab', '*cdef'], true);
            runTest(2, -1, 1, ['a', '_', 'b', '*cdef'], true);
            runTest(2, -1, 2, ['ab', '_', '*cdef'], true);
            runTest(2, -1, 3, ['ab', '*c', '_', '*def'], true);
            runTest(2, -1, 6, ['ab', '*cdef', '_'], true);
        });

        it('start at end', () => {
            runTest(6, -1, -1, ['abcdef', '*'], true);
            runTest(6, -1, 0, ['_', 'abcdef', '*'], true);
            runTest(6, -1, 3, ['abc', '_', 'def', '*'], true);
            runTest(6, -1, 6, ['abcdef', '_', '*'], true);
        });
    });

    describe('Has end', () => {
        it('end at 0', () => {
            runTest(-1, 0, -1, ['*', 'abcdef'], false, true);
            runTest(-1, 0, 0, ['*', '_', 'abcdef'], false, true);
            runTest(-1, 0, 3, ['*', 'abc', '_', 'def'], false, true);
            runTest(-1, 0, 6, ['*', 'abcdef', '_'], false, true);
        });

        it('end at middle', () => {
            runTest(-1, 4, -1, ['*abcd', 'ef'], false, true);
            runTest(-1, 4, 0, ['_', '*abcd', 'ef'], false, true);
            runTest(-1, 4, 3, ['*abc', '_', '*d', 'ef'], false, true);
            runTest(-1, 4, 4, ['*abcd', '_', 'ef'], false, true);
            runTest(-1, 4, 5, ['*abcd', 'e', '_', 'f'], false, true);
            runTest(-1, 4, 6, ['*abcd', 'ef', '_'], false, true);
        });

        it('end at end', () => {
            runTest(-1, 6, -1, ['*abcdef'], false, true);
            runTest(-1, 6, 0, ['_', '*abcdef'], false, true);
            runTest(-1, 6, 3, ['*abc', '_', '*def'], false, true);
            runTest(-1, 6, 6, ['*abcdef', '_'], false, true);
        });
    });

    describe('Has same start and end', () => {
        it('at 0', () => {
            runTest(0, 0, -1, ['*', 'abcdef'], false);
            runTest(0, 0, 0, ['*', '_', 'abcdef'], false);
            runTest(0, 0, 3, ['*', 'abc', '_', 'def'], false);
            runTest(0, 0, 6, ['*', 'abcdef', '_'], false);
        });

        it('at middle', () => {
            runTest(3, 3, -1, ['abc', '*', 'def'], false);
            runTest(3, 3, 0, ['_', 'abc', '*', 'def'], false);
            runTest(3, 3, 2, ['ab', '_', 'c', '*', 'def'], false);
            runTest(3, 3, 3, ['abc', '*', '_', 'def'], false);
            runTest(3, 3, 4, ['abc', '*', 'd', '_', 'ef'], false);
            runTest(3, 3, 6, ['abc', '*', 'def', '_'], false);
        });

        it('at end', () => {
            runTest(6, 6, -1, ['abcdef', '*'], false);
            runTest(6, 6, 0, ['_', 'abcdef', '*'], false);
            runTest(6, 6, 3, ['abc', '_', 'def', '*'], false);
            runTest(6, 6, 6, ['abcdef', '*', '_'], false);
        });
    });

    describe('Has different start and end', () => {
        it('start at 0, end at end', () => {
            runTest(0, 6, -1, ['*abcdef'], false);
            runTest(0, 6, 0, ['_', '*abcdef'], false);
            runTest(0, 6, 3, ['*abc', '_', '*def'], false);
            runTest(0, 6, 6, ['*abcdef', '_'], false);
        });

        it('start at 0, end at 3', () => {
            runTest(0, 3, -1, ['*abc', 'def'], false);
            runTest(0, 3, 0, ['_', '*abc', 'def'], false);
            runTest(0, 3, 2, ['*ab', '_', '*c', 'def'], false);
            runTest(0, 3, 3, ['*abc', '_', 'def'], false);
            runTest(0, 3, 4, ['*abc', 'd', '_', 'ef'], false);
            runTest(0, 3, 6, ['*abc', 'def', '_'], false);
        });

        it('start at 3, end at end', () => {
            runTest(3, 6, -1, ['abc', '*def'], false);
            runTest(3, 6, 0, ['_', 'abc', '*def'], false);
            runTest(3, 6, 2, ['ab', '_', 'c', '*def'], false);
            runTest(3, 6, 3, ['abc', '_', '*def'], false);
            runTest(3, 6, 4, ['abc', '*d', '_', '*ef'], false);
            runTest(3, 6, 6, ['abc', '*def', '_'], false);
        });

        it('start at 2, end at 4', () => {
            runTest(2, 4, -1, ['ab', '*cd', 'ef'], false);
            runTest(2, 4, 0, ['_', 'ab', '*cd', 'ef'], false);
            runTest(2, 4, 1, ['a', '_', 'b', '*cd', 'ef'], false);
            runTest(2, 4, 2, ['ab', '_', '*cd', 'ef'], false);
            runTest(2, 4, 3, ['ab', '*c', '_', '*d', 'ef'], false);
            runTest(2, 4, 4, ['ab', '*cd', '_', 'ef'], false);
            runTest(2, 4, 5, ['ab', '*cd', 'e', '_', 'f'], false);
            runTest(2, 4, 6, ['ab', '*cd', 'ef', '_'], false);
        });
    });
});

function translate(input: ContentModelSegment): string {
    if (input.segmentType == 'Text') {
        return input.isSelected ? '*' + input.text : input.text;
    } else if (input.segmentType == 'SelectionMarker') {
        return input.isShadowMarker ? '_' : '*';
    } else {
        throw new Error('Wrong input type');
    }
}
