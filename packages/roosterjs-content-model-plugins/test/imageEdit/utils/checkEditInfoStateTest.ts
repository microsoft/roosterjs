import { checkEditInfoState } from '../../../lib/imageEdit/utils/checkEditInfoState';
import { ImageMetadataFormat } from 'roosterjs-content-model-types';

describe('checkEditInfoState', () => {
    function runTest(
        editInfo: ImageMetadataFormat,
        expectResult: string,
        compareTo?: ImageMetadataFormat
    ) {
        const result = checkEditInfoState(editInfo, compareTo);
        expect(result).toBe(expectResult);
    }

    it('should return invalid', () => {
        runTest({}, 'Invalid');
    });

    it('should return ResizeOnly', () => {
        runTest(
            {
                src: 'test',
                widthPx: 20,
                heightPx: 20,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            },
            'ResizeOnly',
            {
                src: 'test',
                widthPx: 10,
                heightPx: 10,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            }
        );
    });

    it('should return SameWithLast', () => {
        runTest(
            {
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
            },
            'SameWithLast',
            {
                src: 'test',
                widthPx: 20,
                heightPx: 20,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0.1,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            }
        );
    });

    it('should return FullyChanged', () => {
        runTest(
            {
                src: 'test',
                widthPx: 20,
                heightPx: 20,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0.1,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 30,
            },
            'FullyChanged',
            {
                src: 'test',
                widthPx: 20,
                heightPx: 20,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            }
        );
    });
});
