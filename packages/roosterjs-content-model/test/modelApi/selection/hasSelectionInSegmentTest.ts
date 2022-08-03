import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { hasSelectionInSegment } from '../../../lib/modelApi/selection/hasSelectionInSegment';

describe('hasSelectionInSegment', () => {
    it('Simple text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.Text,
            text: '',
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple text segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.Text,
            text: '',
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('Simple BR segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.Br,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple BR segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.Br,
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('SelectionMarker segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.SelectionMarker,
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('Empty general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: null!,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Empty general segment with direct selection', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [],
            element: null!,
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('General segment with child', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [],
                },
            ],
            element: null!,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('General segment with selected child', () => {
        const segment: ContentModelSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Br,
                            isSelected: true,
                        },
                    ],
                },
            ],
            element: null!,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });
});
