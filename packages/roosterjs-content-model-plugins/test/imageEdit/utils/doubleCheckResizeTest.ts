import { doubleCheckResize } from '../../../lib/imageEdit/utils/doubleCheckResize';

describe('doubleCheckResize', () => {
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

    function runTest(preserveRatio: boolean, actualWidth: number, actualHeight: number) {
        const { heightPx, widthPx } = editInfo;
        const ratio = widthPx / heightPx;
        doubleCheckResize(editInfo, preserveRatio, actualWidth, actualHeight);

        if (preserveRatio) {
            if (actualWidth < widthPx) {
                expect(editInfo.heightPx).toBe(actualWidth / ratio);
            } else {
                expect(editInfo.widthPx).toBe(actualHeight * ratio);
            }
        } else {
            expect(editInfo.heightPx).toBe(actualHeight);
            expect(editInfo.widthPx).toBe(actualWidth);
        }
    }

    it('should preserve ratio | adjust height', () => {
        runTest(true, 10, 10);
    });

    it('should preserve ratio | adjust width', () => {
        runTest(true, 30, 30);
    });

    it('should not preserve ratio', () => {
        runTest(false, 30, 30);
    });
});
