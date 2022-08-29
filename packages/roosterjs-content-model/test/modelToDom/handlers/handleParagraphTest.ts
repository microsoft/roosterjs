import * as handleSegment from '../../../lib/modelToDom/handlers/handleSegment';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
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
                blockType: ContentModelBlockType.Paragraph,
                segments: [],
            },
            '<div></div>',
            0
        );
    });

    it('Handle empty implicit paragraph', () => {
        runTest(
            {
                blockType: ContentModelBlockType.Paragraph,
                segments: [],
                isImplicit: true,
            },
            '',
            0
        );
    });

    it('Handle paragraph with single text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.Text,
            text: 'test',
        };
        runTest(
            {
                blockType: ContentModelBlockType.Paragraph,
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
            segmentType: ContentModelSegmentType.Text,
            text: 'test',
        };
        runTest(
            {
                blockType: ContentModelBlockType.Paragraph,
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
            segmentType: ContentModelSegmentType.Text,
            text: 'test',
        };
        const segment2: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: null!,
        };
        runTest(
            {
                blockType: ContentModelBlockType.Paragraph,
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
