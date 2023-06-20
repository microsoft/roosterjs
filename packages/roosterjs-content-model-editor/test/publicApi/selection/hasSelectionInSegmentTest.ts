import hasSelectionInSegment from '../../../lib/publicApi/selection/hasSelectionInSegment';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';

describe('hasSelectionInSegment', () => {
    it('Simple text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: '',
            format: {},
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple text segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: '',
            isSelected: true,
            format: {},
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('Simple BR segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Br',
            format: {},
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeFalse();
    });

    it('Simple BR segment with selection', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Br',
            isSelected: true,
            format: {},
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });

    it('SelectionMarker segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
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
            format: {},
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
            format: {},
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
                    format: {},
                },
            ],
            format: {},
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
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            element: null!,
            format: {},
        };
        const result = hasSelectionInSegment(segment);
        expect(result).toBeTrue();
    });
});
