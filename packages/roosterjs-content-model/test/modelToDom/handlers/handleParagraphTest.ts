import * as handleSegment from '../../../lib/modelToDom/handlers/handleSegment';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleParagraph } from '../../../lib/modelToDom/handlers/handleParagraph';
import { ModelToDomContext } from '../../../lib/modelToDom/context/ModelToDomContext';

describe('handleParagraph', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        spyOn(handleSegment, 'handleSegment');
        parent = document.createElement('div');
        context = createModelToDomContext();
    });

    function runTest(
        paragraph: ContentModelParagraph,
        expectedInnerHTML: string,
        expectedCreateSegmentFromContentCalledTimes: number
    ) {
        handleParagraph(document, parent, paragraph, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleSegment.handleSegment).toHaveBeenCalledTimes(
            expectedCreateSegmentFromContentCalledTimes
        );
    }

    it('Handle empty explicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
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
            },
            '<div></div>',
            1
        );

        expect(handleSegment.handleSegment).toHaveBeenCalledWith(
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
            },
            '',
            1
        );

        expect(handleSegment.handleSegment).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context
        );
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
            },
            '<div></div>',
            2
        );

        expect(handleSegment.handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment1,
            context
        );
        expect(handleSegment.handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment2,
            context
        );
    });
});
