import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { handleSegment } from '../../../lib/modelToDom/handlers/handleSegment';

describe('handleSegment', () => {
    let parent: HTMLElement;

    beforeEach(() => {
        spyOn(handleBlock, 'handleBlock');
    });

    function runTest(
        segment: ContentModelSegment,
        expectedInnerHTML: string,
        expectedCreateBlockFromContentModelCalledTimes: number
    ) {
        parent = document.createElement('div');

        handleSegment(document, parent, segment);

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

    it('general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: null!,
        };
        runTest(segment, '', 1);
        expect(handleBlock.handleBlock).toHaveBeenCalledWith(document, parent, segment);
    });
});
