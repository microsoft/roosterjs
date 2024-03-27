import * as addSelectionMarker from '../../../lib/domToModel/utils/addSelectionMarker';
import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { DomToModelContext } from 'roosterjs-content-model-types';
import { textWithSelectionProcessor } from '../../../lib/domToModel/processors/textWithSelectionProcessor';

describe('textWithSelectionProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty group', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Space only text without existing paragraph', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode(' ');

        textWithSelectionProcessor(doc, text, context);

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
        textWithSelectionProcessor(doc, text, context);

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
        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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

        textWithSelectionProcessor(doc, text, context);

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
