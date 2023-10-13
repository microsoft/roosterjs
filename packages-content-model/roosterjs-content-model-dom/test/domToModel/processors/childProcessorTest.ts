import { childProcessor } from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { generalProcessor } from '../../../lib/domToModel/processors/generalProcessor';
import {
    ContentModelDocument,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

describe('childProcessor', () => {
    let doc: ContentModelDocument;
    let context: DomToModelContext;
    let textProcessor: jasmine.Spy<ElementProcessor<Text>>;

    beforeEach(() => {
        textProcessor = jasmine.createSpy('textProcessor');
        doc = createContentModelDocument();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                '#text': textProcessor,
            },
        });
    });

    it('Process a document fragment', () => {
        const fragment = document.createDocumentFragment();

        childProcessor(doc, fragment, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(textProcessor).not.toHaveBeenCalled();
    });

    it('Process an empty DIV', () => {
        const div = document.createElement('div');

        childProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(textProcessor).not.toHaveBeenCalled();
    });

    it('Process a DIV with text node', () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');
        div.appendChild(text);

        childProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(textProcessor).toHaveBeenCalledTimes(1);
        expect(textProcessor).toHaveBeenCalledWith(doc, text, context);
    });

    it('Process a DIV with SPAN node', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        childProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(textProcessor).not.toHaveBeenCalled();
    });

    it('Process a DIV with SPAN, DIV and text node', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const innerDiv = document.createElement('div');
        const text = document.createTextNode('test');
        div.appendChild(span);
        div.appendChild(innerDiv);
        div.appendChild(text);

        childProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
        expect(textProcessor).toHaveBeenCalledTimes(1);
        expect(textProcessor).toHaveBeenCalledWith(doc, text, context);
    });
});

describe('childProcessor', () => {
    let doc: ContentModelDocument;
    let context: DomToModelContext;

    beforeEach(() => {
        doc = createContentModelDocument();
        context = createDomToModelContext();
    });

    it('Process a DIV with element selection', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test1</span><span>test2</span><span>test3</span>';
        context.selection = {
            type: 'range',
            range: {
                startContainer: div,
                startOffset: 1,
                endContainer: div,
                endOffset: 2,
                collapsed: false,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process a DIV with element collapsed selection', () => {
        const div = document.createElement('div');

        div.innerHTML = '<span>test1</span><span>test2</span><span>test3</span>';
        context.selection = {
            type: 'range',
            range: {
                startContainer: div,
                startOffset: 1,
                endContainer: div,
                endOffset: 1,
                collapsed: true,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process a DIV with SPAN and text selection', () => {
        const div = document.createElement('div');

        div.innerHTML = 'test1test2test3';
        context.selection = {
            type: 'range',
            range: {
                startContainer: div.firstChild!,
                startOffset: 5,
                endContainer: div.firstChild!,
                endOffset: 10,
                collapsed: false,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process a DIV with SPAN and collapsed text selection', () => {
        const div = document.createElement('div');

        div.innerHTML = 'test1test2test3';
        context.selection = {
            type: 'range',
            range: {
                startContainer: div.firstChild!,
                startOffset: 5,
                endContainer: div.firstChild!,
                endOffset: 5,
                collapsed: true,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2test3', format: {} },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process a DIV with mixed selection', () => {
        const div = document.createElement('div');

        div.innerHTML = '<span>test1</span>test2test3';
        context.selection = {
            type: 'range',
            range: {
                startContainer: div.firstChild!,
                startOffset: 1,
                endContainer: div.lastChild!,
                endOffset: 5,
                collapsed: false,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                { segmentType: 'Text', text: 'test2', format: {}, isSelected: true },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process with segment format', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';
        context.segmentFormat = { a: 'b' } as any;

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [{ segmentType: 'Text', text: 'test', format: { a: 'b' } as any }],
            isImplicit: true,
            format: {},
        });
    });

    it('Process with segment format and selection marker', () => {
        const div = document.createElement('div');

        context.segmentFormat = { a: 'b' } as any;
        context.selection = {
            type: 'range',
            range: {
                startContainer: div,
                startOffset: 0,
                endContainer: div,
                endOffset: 0,
                collapsed: true,
            } as any,
        };

        childProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'SelectionMarker', format: { a: 'b' } as any, isSelected: true },
            ],
            isImplicit: true,
            format: {},
        });
    });

    it('Process lists that are under different container', () => {
        const div = document.createElement('div');
        div.innerHTML =
            '<div id="div1"><ol><li>test1</li></ol></div><div id="div2">test2</div><div id="div3"><ol><li>test3</li></ol></div>';

        context = createDomToModelContext(undefined, {
            processorOverride: {
                div: generalProcessor,
            },
        });

        childProcessor(doc, div, context);

        expect(doc.blocks.length).toBe(3);
        expect(doc.blocks[0]).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: div.querySelector('#div1') as HTMLElement,
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', format: {}, dataset: {} }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            isImplicit: true,
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
                    format: {},
                },
            ],
            format: {},
        });
        expect(doc.blocks[1]).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: div.querySelector('#div2') as HTMLElement,
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        });
        expect(doc.blocks[2]).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: div.querySelector('#div3') as HTMLElement,
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            isImplicit: true,
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        });

        expect(context.listFormat).toEqual({
            levels: [],
            listParent: undefined,
            threadItemCounts: [1],
        });
    });
});
