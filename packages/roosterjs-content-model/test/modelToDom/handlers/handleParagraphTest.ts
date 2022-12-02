import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleParagraph } from '../../../lib/modelToDom/handlers/handleParagraph';
import { handleSegment as originalHandleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

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
        handleParagraph(document, parent, paragraph, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleSegment).toHaveBeenCalledTimes(expectedCreateSegmentFromContentCalledTimes);
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
            '<p style="margin-top: 0px; margin-bottom: 0px;"><span>test</span></p>',
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
            '<p><span>test</span></p>',
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
            '<h1><span>test</span></h1>',
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
            '<h1 style="font-size: 20px;"><span>test</span></h1>',
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
            '<h1 style="font-weight: normal;"><span>test</span></h1>',
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
                        format: {},
                        text: 'test 2',
                    },
                ],
            },
            '<h1><span>test 1</span><span style="font-weight: normal;">test 2</span></h1>',
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
            '<h1><span><i>test</i></span></h1>',
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
            '<div style="text-align: center;"><span>test</span></div>',
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
            '<h1><span>test</span></h1>',
            1
        );

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(2);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('h1');
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(1)[1]).toBe(null);
    });
});
