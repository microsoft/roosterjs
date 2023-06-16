import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleParagraph } from '../../../lib/modelToDom/handlers/handleParagraph';
import { handleSegment as originalHandleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { optimize } from '../../../lib/modelToDom/optimizers/optimize';

describe('handleParagraph', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleSegment: jasmine.Spy<ContentModelHandler<ContentModelSegment>>;

    beforeEach(() => {
        parent = document.createElement('div');
        handleSegment = jasmine.createSpy('handleSegment');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                segment: handleSegment,
            },
        });
    });

    function runTest(
        paragraph: ContentModelParagraph,
        expectedInnerHTML: string,
        expectedCreateSegmentFromContentCalledTimes: number
    ) {
        handleParagraph(document, parent, paragraph, context, null);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleSegment).toHaveBeenCalledTimes(expectedCreateSegmentFromContentCalledTimes);
        expect(paragraph.cachedElement).toBe((parent.firstChild as HTMLElement) || undefined);
    }

    it('Handle empty explicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            },
            '<div></div>',
            0
        );
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
            0
        );
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
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment,
            context
        );
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
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(document, parent, segment, context);
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
            2
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment1,
            context
        );
        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment2,
            context
        );
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
            1
        );
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
            1
        );
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
            1
        );
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
            1
        );
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
            1
        );
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
            2
        );
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
            1
        );
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
            1
        );
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
            1
        );

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(2);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('h1');
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

        optimize(parent);

        expect(parent.innerHTML).toBe(
            '<div style="white-space: pre;">test1</div><div style="white-space: pre;">test2</div><br>'
        );
        expect(para1.cachedElement).toBe(parent.firstChild as HTMLElement);
        expect(para1.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test1</div>');
        expect(para2.cachedElement).toBe(parent.firstChild?.nextSibling as HTMLElement);
        expect(para2.cachedElement?.outerHTML).toBe('<div style="white-space: pre;">test2</div>');
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
    });
});
