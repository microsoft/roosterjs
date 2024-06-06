import { getGeneratedImageSize } from '../../../lib/imageEdit/utils/generateImageSize';

describe('generateImageSize', () => {
    it('beforeCrop false', () => {
        const editInfo = {
            src: 'test',
            widthPx: 20,
            heightPx: 20,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0.1,
            bottomPercent: 0,
            angleRad: 0,
        };
        const result = getGeneratedImageSize(editInfo, true);
        expect(result).toEqual({
            targetHeight: 22.22222222222222,
            targetWidth: 20,
            visibleHeight: 22.22222222222222,
            visibleWidth: 20,
            originalHeight: 22.22222222222222,
            originalWidth: 20,
        });
    });

    it('beforeCrop true', () => {
        const editInfo = {
            src: 'test',
            widthPx: 20,
            heightPx: 20,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0.1,
            bottomPercent: 0,
            angleRad: 0,
        };
        const result = getGeneratedImageSize(editInfo, true);
        expect(result).toEqual({
            targetHeight: 22.22222222222222,
            targetWidth: 20,
            visibleHeight: 22.22222222222222,
            visibleWidth: 20,
            originalHeight: 22.22222222222222,
            originalWidth: 20,
        });
    });
});
