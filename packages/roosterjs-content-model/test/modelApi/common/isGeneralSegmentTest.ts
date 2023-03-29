import { isGeneralSegment } from '../../../lib/modelApi/common/isGeneralSegment';

describe('isGeneralSegment', () => {
    it('Not a general model', () => {
        const result = isGeneralSegment({
            blockGroupType: 'Document',
            blocks: [],
        });

        expect(result).toBeFalse();
    });

    it('General block', () => {
        const result = isGeneralSegment({
            blockGroupType: 'General',
            blockType: 'BlockGroup',
            blocks: [],
            format: {},
            element: null!,
        });

        expect(result).toBeFalse();
    });

    it('General segment', () => {
        const result = isGeneralSegment({
            blockGroupType: 'General',
            blockType: 'BlockGroup',
            segmentType: 'General',
            blocks: [],
            format: {},
            element: null!,
        });

        expect(result).toBeTrue();
    });
});
