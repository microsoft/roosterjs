import getTargetSizeByPercentage from '../../lib/plugins/ImageEdit/editInfoUtils/getTargetSizeByPercentage';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';

describe('getTargetSizeByPercentage', () => {
    function runTest(
        editInfo: ImageEditInfo,
        percentage: number,
        expectWidth: number,
        expectHeight: number
    ) {
        const result = getTargetSizeByPercentage(editInfo, percentage);
        expect(result.width).toBe(expectWidth);
        expect(result.height).toBe(expectHeight);
    }

    it('should return 50%', () => {
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            src: 'test',
            widthPx: 100,
            heightPx: 100,
            angleRad: 0,
        };
        runTest(editInfo, 0.5, 50, 50);
    });

    it('should return 50% of image that was cropped in half;', () => {
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0.5,
            bottomPercent: 0.5,
            src: 'test',
            widthPx: 100,
            heightPx: 100,
            angleRad: 0,
        };
        runTest(editInfo, 0.5, 25, 25);
    });
});
