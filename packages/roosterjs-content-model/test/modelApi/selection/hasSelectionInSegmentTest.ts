import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { hasSelectionInSegment } from '../../../lib/modelApi/selection/hasSelectionInSegment';

describe('hasSelectionInSegment', () => {
    it('Simple text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: '',
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple text segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: '',
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('Simple BR segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Br',
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple BR segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Br',
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('SelectionMarker segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'SelectionMarker',
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('Empty general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Empty general segment with direct selection', () => {
        const segment: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
            isSelected: true,
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('General segment with child', () => {
        const segment: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [
                {
                    blockType: 'Paragraph',
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
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
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
