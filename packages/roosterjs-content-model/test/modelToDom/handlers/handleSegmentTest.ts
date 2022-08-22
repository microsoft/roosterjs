import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/modelToDom/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        spyOn(handleBlock, 'handleBlock');
        context = createModelToDomContext();
    });

    function runTest(
        segment: ContentModelSegment,
        expectedInnerHTML: string,
        expectedCreateBlockFromContentModelCalledTimes: number
    ) {
        parent = document.createElement('div');

        handleSegment(document, parent, segment, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleBlock.handleBlock).toHaveBeenCalledTimes(
            expectedCreateBlockFromContentModelCalledTimes
        );
    }

    it('Text segment', () => {
        runTest(
            {
                segmentType: ContentModelSegmentType.Text,
                text: 'test',
            },
            '<span>test</span>',
            0
        );
    });

    it('Br segment', () => {
        runTest(
            {
                segmentType: ContentModelSegmentType.Br,
            },
            '<br>',
            0
        );
    });

    it('general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: null!,
        };
        runTest(segment, '', 1);
        expect(handleBlock.handleBlock).toHaveBeenCalledWith(document, parent, segment, context);
    });
});
