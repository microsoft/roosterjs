import * as createGeneralBlock from '../../../lib/modelApi/creators/createGeneralBlock';
import * as createGeneralSegment from '../../../lib/modelApi/creators/createGeneralSegment';
import { childProcessor as originalChildProcessor } from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { generalProcessor } from '../../../lib/domToModel/processors/generalProcessor';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    ContentModelGeneralBlock,
    ContentModelGeneralSegment,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

describe('generalProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<ParentNode>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childProcessor,
            },
        });
    });

    it('Process a DIV element', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const block: ContentModelGeneralBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: div,
            blocks: [],
            format: {},
        };

        spyOn(createGeneralBlock, 'createGeneralBlock').and.returnValue(block);
        generalProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [block],
        });
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledTimes(1);
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledWith(div);
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(block, div, context);
    });

    it('Process a SPAN element', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        const segment: ContentModelGeneralSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: span,
            blocks: [],
            format: {},
        };

        spyOn(createGeneralSegment, 'createGeneralSegment').and.returnValue(segment);

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [segment],
                    format: {},
                },
            ],
        });
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledTimes(1);
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledWith(span, {});
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(segment, span, context);
    });

    it('Process a SPAN element with format', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        context.segmentFormat = { a: 'b' } as any;

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: { a: 'b' } as any,
                            blocks: [],
                            element: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Process a SPAN element with link format', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        context.link = {
            format: { href: '/test' },
            dataset: {},
        };

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            link: { format: { href: '/test' }, dataset: {} },
                            blocks: [],
                            element: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Process a SPAN element with partial selection 1', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        context.rangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    startContainer: text,
                    startOffset: 1,
                    endContainer: text,
                    endOffset: 3,
                    collapsed: false,
                } as any,
            ],
            areAllCollapsed: false,
        };

        childProcessor.and.callFake(originalChildProcessor);

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 't',
                                            format: {},
                                        },
                                        {
                                            segmentType: 'Text',
                                            text: 'es',
                                            format: {},
                                            isSelected: true,
                                        },
                                        {
                                            segmentType: 'Text',
                                            text: 't',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            element: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Process a SPAN element with partial selection 2 - already in selection', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        context.rangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    startContainer: text,
                    startOffset: 1,
                    endContainer: text,
                    endOffset: 3,
                    collapsed: false,
                } as any,
            ],
            areAllCollapsed: false,
        };
        context.isInSelection = true;

        childProcessor.and.callFake(originalChildProcessor);

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'tes',
                                            format: {},
                                            isSelected: true,
                                        },
                                        {
                                            segmentType: 'Text',
                                            text: 't',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            element: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Process a SPAN element with full selection', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');

        context.isInSelection = true;

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: {},
                            blocks: [],
                            element: span,
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
