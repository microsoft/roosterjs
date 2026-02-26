import * as reuseCachedElement from '../../../lib/domUtils/reuseCachedElement';
import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import * as unwrap from '../../../lib/domUtils/unwrap';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleParagraph } from '../../../lib/modelToDom/handlers/handleParagraph';
import { handleSegment as originalHandleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { optimize } from '../../../lib/modelToDom/optimizers/optimize';
import {
    DomIndexer,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentHandler,
    ModelToDomContext,
    ModelToDomSegmentContext,
} from 'roosterjs-content-model-types';

describe('handleParagraph', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleSegment: jasmine.Spy<ContentModelSegmentHandler<ContentModelSegment>>;
    let applyMarkerToDomSpy: jasmine.Spy;

    beforeEach(() => {
        parent = document.createElement('div');
        handleSegment = jasmine.createSpy('handleSegment');
        applyMarkerToDomSpy = jasmine.createSpy('applyMarkerToDom');
        context = createModelToDomContext(
            {
                allowCacheElement: true,
            },
            {
                modelHandlerOverride: {
                    segment: handleSegment,
                },
            }
        );

        context.paragraphMap = {
            applyMarkerToDom: applyMarkerToDomSpy,
        } as any;
    });

    function runTest(
        paragraph: ContentModelParagraph,
        expectedInnerHTML: string,
        expectedCreateSegmentFromContentCalledTimes: number,
        applyMarkerToDomCalledTimes: number
    ) {
        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleSegment).toHaveBeenCalledTimes(expectedCreateSegmentFromContentCalledTimes);
        expect(paragraph.cachedElement).toBe((parent.firstChild as HTMLElement) || undefined);
        expect(applyMarkerToDomSpy).toHaveBeenCalledTimes(applyMarkerToDomCalledTimes);
    }

    it('Handle empty explicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            },
            '<div></div>',
            0,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Handle empty implicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
                isImplicit: true,
                format: {},
            },
            '',
            0,
            0
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('Handle paragraph with single text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment],
                format: {},
            },
            '<div></div>',
            1,
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment,
            context,
            []
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Handle implicit paragraph single text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment],
                isImplicit: true,
                format: {},
            },
            '',
            1,
            0
        );

        expect(handleSegment).toHaveBeenCalledWith(document, parent, segment, context, []);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('Handle multiple segments', () => {
        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment1, segment2],
                format: {},
            },
            '<div></div>',
            2,
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment1,
            context,
            []
        );
        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment2,
            context,
            []
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle p without margin', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'p',
                    format: {},
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: {},
                        text: 'test',
                    },
                ],
            },
            '<p style="margin-top: 0px; margin-bottom: 0px;">test</p>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle p with margin', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: { marginTop: '1em', marginBottom: '1em' },
                decorator: {
                    tagName: 'p',
                    format: {},
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: {},
                        text: 'test',
                    },
                ],
            },
            '<p>test</p>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle headers', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: { fontWeight: 'bold', fontSize: '2em' },
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold' },
                        text: 'test',
                    },
                ],
            },
            '<h1>test</h1>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle headers with default format override', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: { fontWeight: 'bold', fontSize: '20px' },
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold' },
                        text: 'test',
                    },
                ],
            },
            '<h1 style="font-size: 20px;">test</h1>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle headers without default format', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: {},
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold' },
                        text: 'test',
                    },
                ],
            },
            '<h1>test</h1>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle headers that has non-bold text', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: {
                        fontWeight: 'bold',
                    },
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold' },
                        text: 'test 1',
                    },
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'normal' },
                        text: 'test 2',
                    },
                ],
            },
            '<h1>test 1<span style="font-weight: normal;">test 2</span></h1>',
            2,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle headers with implicit block and other inline format', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                isImplicit: true,
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: { fontWeight: 'bold' },
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold', italic: true },
                        text: 'test',
                    },
                ],
            },
            '<h1><i>test</i></h1>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('handle implicit paragraph with segments and format', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                isImplicit: true,
                format: {
                    textAlign: 'center',
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: {},
                        text: 'test',
                    },
                ],
            },
            '<div style="text-align: center;">test</div>',
            1,
            1
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('call stackFormat', () => {
        handleSegment.and.callFake(originalHandleSegment);

        spyOn(stackFormat, 'stackFormat').and.callThrough();

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                decorator: {
                    tagName: 'h1',
                    format: { fontWeight: 'bold', fontSize: '2em' },
                },
                segments: [
                    {
                        segmentType: 'Text',
                        format: { fontWeight: 'bold' },
                        text: 'test',
                    },
                ],
            },
            '<h1>test</h1>',
            1,
            1
        );

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(2);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('h1');
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Handle paragraph with refNode', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        const br = document.createElement('br');

        const result = parent.appendChild(br);

        handleParagraph(document, parent, paragraph, context, br);

        expect(parent.innerHTML).toBe('<div></div><br>');
        expect(paragraph.cachedElement).toBe(parent.firstChild as HTMLElement);
        expect(result).toBe(br);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Handle paragraph with PRE', () => {
        const segment1 = createText('test1');
        const segment2 = createText('test2');
        const para1 = createParagraph(false, { whiteSpace: 'pre' });
        const para2 = createParagraph(false, { whiteSpace: 'pre' });
        const br = document.createElement('br');

        para1.segments.push(segment1);
        para2.segments.push(segment2);

        parent.appendChild(br);

        handleSegment.and.callFake(originalHandleSegment);

        handleParagraph(document, parent, para1, context, br);
        handleParagraph(document, parent, para2, context, br);

        expect(parent.innerHTML).toBe(
            '<div style="white-space: pre;">test1</div><div style="white-space: pre;">test2</div><br>'
        );
        expect(para1.cachedElement).toBe(parent.firstChild as HTMLElement);
        expect(para1.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test1</div>');
        expect(para2.cachedElement).toBe(parent.firstChild?.nextSibling as HTMLElement);
        expect(para2.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test2</div>');

        optimize(parent, context);

        expect(parent.innerHTML).toBe(
            '<div style="white-space: pre;">test1</div><div style="white-space: pre;">test2</div><br>'
        );
        expect(para1.cachedElement).toBe(parent.firstChild as HTMLElement);
        expect(para1.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test1</div>');
        expect(para2.cachedElement).toBe(parent.firstChild?.nextSibling as HTMLElement);
        expect(para2.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test2</div>');
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [
                parent.firstChild as HTMLElement,
                parent.firstChild!.nextSibling as HTMLElement,
            ],
            removedBlockElements: [],
        });
    });

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div></div>');
        expect(onNodeCreated).toHaveBeenCalledTimes(1);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(paragraph);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('div'));
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('With onNodeCreated on implicit paragraph', () => {
        const parent = document.createElement('div');
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
            isImplicit: true,
        };

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('');
        expect(onNodeCreated).toHaveBeenCalled();
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('Paragraph with only selection marker and BR', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    format: {
                        fontSize: '10px',
                    },
                    isSelected: true,
                },
                {
                    segmentType: 'Br',
                    format: {
                        fontSize: '10px',
                    },
                },
            ],
            format: {},
        };

        handleSegment.and.callFake(originalHandleSegment);

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div><span style="font-size: 10px;"><br></span></div>');

        const div = parent.firstChild as HTMLElement;
        const txt = div.firstChild?.firstChild as Text;
        const br = div.lastChild?.lastChild as HTMLElement;

        expect(div.tagName).toBe('DIV');
        expect(txt.nodeType).toBe(Node.TEXT_NODE);
        expect(txt.nodeValue).toBe('');
        expect(br.tagName).toBe('BR');
        expect(context.regularSelection).toEqual({
            current: { block: div, segment: br },
            start: { block: div, segment: txt },
            end: { block: div, segment: txt },
        });
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Paragraph with inline format', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    format: {
                        fontSize: '10px',
                        fontFamily: 'Arial',
                    },
                    text: 'test',
                },
            ],
            format: {},
            segmentFormat: { fontSize: '10px' },
        };

        handleSegment.and.callFake(originalHandleSegment);

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe(
            '<div style="font-size: 10px;"><span style="font-family: Arial;">test</span></div>'
        );
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Paragraph with domIndexer', () => {
        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            format: {},
            text: 'test',
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Br',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment1, segment2],
            format: {},
        };
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const onParagraphSpy = jasmine.createSpy('onParagraph');
        const domIndexer: DomIndexer = {
            onParagraph: onParagraphSpy,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
            reconcileChildList: null!,
            onBlockEntity: null!,
            reconcileElementId: null!,
            onMergeText: null!,
            clearIndex: null!,
        };

        context.domIndexer = domIndexer;

        handleSegment.and.callFake(originalHandleSegment);

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test<br></div>');
        expect(onParagraphSpy).toHaveBeenCalledTimes(1);
        expect(onParagraphSpy).toHaveBeenCalledWith(parent.firstChild);
        expect(onSegmentSpy).toHaveBeenCalledTimes(2);
        expect(onSegmentSpy).toHaveBeenCalledWith(parent.firstChild!.firstChild, paragraph, [
            segment1,
        ]);
        expect(onSegmentSpy).toHaveBeenCalledWith(parent.firstChild!.lastChild, paragraph, [
            segment2,
        ]);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Implicit paragraph with domIndexer', () => {
        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            format: {},
            text: 'test',
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Br',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment1, segment2],
            format: {},
            isImplicit: true,
        };
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const onParagraphSpy = jasmine.createSpy('onParagraph');
        const domIndexer: DomIndexer = {
            onParagraph: onParagraphSpy,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
            reconcileChildList: null!,
            onBlockEntity: null!,
            reconcileElementId: null!,
            onMergeText: null!,
            clearIndex: null!,
        };

        context.domIndexer = domIndexer;

        const unwrapSpy = spyOn(unwrap, 'unwrap').and.callThrough();
        handleSegment.and.callFake(originalHandleSegment);

        handleParagraph(document, parent, paragraph, context, null);

        const tempContainer = unwrapSpy.calls.argsFor(0)[0] as HTMLElement;

        expect(parent.innerHTML).toBe('test<br>');
        expect(tempContainer.outerHTML).toBe('<div></div>');
        expect(onParagraphSpy).toHaveBeenCalledTimes(1);
        expect(onParagraphSpy).toHaveBeenCalledWith(tempContainer);
        expect(onSegmentSpy).toHaveBeenCalledTimes(2);
        expect(onSegmentSpy).toHaveBeenCalledWith(parent.firstChild, paragraph, [segment1]);
        expect(onSegmentSpy).toHaveBeenCalledWith(parent.lastChild, paragraph, [segment2]);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });
});

describe('Handle paragraph and adjust selections', () => {
    it('Selection is at beginning, followed by BR', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div><br></div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is at beginning, followed by Text', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 0,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 0,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is in middle of text', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1test2</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is at end of text', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Br',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1<br>test2</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.lastChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).not.toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is in middle of text, expanded', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
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
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test3',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1test2test3</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 10,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.lastChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is in front of text, expanded', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1test2</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: null,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.lastChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is at the end of text, expanded', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
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
                    isSelected: true,
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1test2</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.lastChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Selection is in middle of text and BR, expanded', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
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
                    isSelected: true,
                },
                {
                    segmentType: 'Br',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test3',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    text: 'test4',
                    format: {},
                },
            ],
        };

        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe('<div>test1test2<br>test3test4</div>');
        expect(context.regularSelection.start).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.firstChild,
            offset: 5,
        });
        expect(context.regularSelection.end).toEqual({
            block: parent.firstChild,
            segment: parent.firstChild!.lastChild,
            offset: 5,
        });
        expect(parent.firstChild!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.lastChild!.nodeType).toBe(Node.TEXT_NODE);
        expect(parent.firstChild!.firstChild).not.toBe(parent.firstChild!.lastChild);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [parent.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('Has cache', () => {
        const div = document.createElement('div');
        const parent = document.createElement('div');
        const paraModel = createParagraph();
        const reuseCachedElementSpy = spyOn(
            reuseCachedElement,
            'reuseCachedElement'
        ).and.callThrough();
        const context = createModelToDomContext();

        div.id = 'div1';
        paraModel.cachedElement = div;
        context.allowCacheElement = true;

        handleParagraph(document, parent, paraModel, context, null);

        expect(parent.innerHTML).toBe('<div id="div1"></div>');
        expect(parent.firstChild).toBe(div);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
        expect(reuseCachedElementSpy).toHaveBeenCalledWith(
            parent,
            div,
            null,
            context.rewriteFromModel
        );
    });

    describe('noFollowingTextSegmentOrLast', () => {
        let parent: HTMLElement;
        let context: ModelToDomContext;
        let handleSegment: jasmine.Spy<ContentModelSegmentHandler<ContentModelSegment>>;

        beforeEach(() => {
            parent = document.createElement('div');
            handleSegment = jasmine.createSpy('handleSegment');
            context = createModelToDomContext(
                {
                    allowCacheElement: true,
                },
                {
                    modelHandlerOverride: {
                        segment: handleSegment,
                    },
                }
            );
        });

        it('should be true for the only text segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [{ segmentType: 'Text', text: 'hello', format: {} }],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect(captured).toEqual([true]);
        });

        it('should be false for text before another text segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'first', format: {} },
                    { segmentType: 'Text', text: 'second', format: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect(captured).toEqual([false, true]);
        });

        it('should be true for text followed by a Br segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    { segmentType: 'Br', format: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            // Text is followed by Br (non-text), so noFollowingTextSegmentOrLast is true for text; also true for Br
            expect(captured).toEqual([true, true]);
        });

        it('should be true for text followed by an Image segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    { segmentType: 'Image', src: 'test.png', format: {}, dataset: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect(captured).toEqual([true, true]);
        });

        it('should skip SelectionMarker when determining next text segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'first', format: {} },
                    { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    { segmentType: 'Text', text: 'second', format: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            // first text -> marker -> second text: first=false, marker=false, second=true
            expect(captured).toEqual([false, false, true]);
        });

        it('should be true when text is followed by SelectionMarker only', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            // text -> marker (no text after): both should be true
            expect(captured).toEqual([true, true]);
        });

        it('should be true for text followed by Entity segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const wrapper = document.createElement('span');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    {
                        segmentType: 'Entity',
                        blockType: 'Entity',
                        entityFormat: { entityType: 'test', id: 'e1', isReadonly: true },
                        format: {},
                        wrapper,
                    },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect(captured).toEqual([true, true]);
        });

        it('should handle text followed by General segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    {
                        segmentType: 'General',
                        blockType: 'BlockGroup',
                        blockGroupType: 'General',
                        blocks: [],
                        element: document.createElement('span'),
                        format: {},
                    },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect(captured).toEqual([true, true]);
        });

        it('should be false for text when text comes after non-text segment', () => {
            const captured: (boolean | undefined)[] = [];
            handleSegment.and.callFake((_doc, _parent, _seg, ctx) => {
                captured.push((ctx as ModelToDomSegmentContext).noFollowingTextSegmentOrLast);
            });

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    { segmentType: 'Text', text: 'first', format: {} },
                    { segmentType: 'Br', format: {} },
                    { segmentType: 'Text', text: 'second', format: {} },
                ],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            // first text: Br is next non-marker -> false (Br breaks, no text immediately), but actually
            // hasTextSegmentAfter looks past Br to find Text, Br is not Text so returns false at index 0
            // Br at index 1: next is Text -> false? No, hasTextSegmentAfter checks if type === 'Text'
            // Actually: index 0 -> next is Br (not SelectionMarker, not Text) -> false -> noFollowingTextSegmentOrLast=true
            // index 1 (Br) -> next is Text -> true -> noFollowingTextSegmentOrLast=false
            // index 2 (Text) -> no more -> noFollowingTextSegmentOrLast=true
            expect(captured).toEqual([true, false, true]);
        });

        it('should be cleaned up after processing paragraph', () => {
            handleSegment.and.callFake(() => {});

            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [{ segmentType: 'Text', text: 'hello', format: {} }],
                format: {},
            };
            handleParagraph(document, parent, paragraph, context, null);

            expect((context as ModelToDomSegmentContext).noFollowingTextSegmentOrLast).toBeUndefined();
        });
    });
});
