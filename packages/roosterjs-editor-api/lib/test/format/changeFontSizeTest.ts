import { FONT_SIZES, getNewFontSize } from '../../format/changeFontSize';

describe('changeFontSize()', () => {
    function runTest(currentSize: number, isIncrease: boolean, expectedSize: number) {
        expect(getNewFontSize(currentSize, isIncrease ? 1 : -1, FONT_SIZES)).toBe(
            expectedSize,
            `input: ${currentSize}, isIncrease: ${isIncrease}`
        );
    }

    function testIncrease(currentSize: number, expectedSize: number) {
        runTest(currentSize, true, expectedSize);
    }

    function testDecrease(currentSize: number, expectedSize: number) {
        runTest(currentSize, false, expectedSize);
    }

    it('Test increase font size', () => {
        testIncrease(0, 1);
        testIncrease(0.5, 1);
        testIncrease(1, 2);
        testIncrease(1.5, 2);
        testIncrease(7.5, 8);
        testIncrease(8, 9);
        testIncrease(8.5, 9);
        testIncrease(11, 12);
        testIncrease(11.5, 12);
        testIncrease(12, 14);
        testIncrease(12.5, 14);
        testIncrease(13.5, 14);
        testIncrease(14, 16);
        testIncrease(28, 36);
        testIncrease(28.5, 36);
        testIncrease(36, 48);
        testIncrease(48.5, 72);
        testIncrease(71.5, 72);
        testIncrease(72, 80);
        testIncrease(79.5, 80);
        testIncrease(80, 90);
    });

    it('Test decrease font size', () => {
        testDecrease(0, 1);
        testDecrease(0.5, 1);
        testDecrease(1, 1);
        testDecrease(1.5, 1);
        testDecrease(2, 1);
        testDecrease(7.5, 7);
        testDecrease(8, 7);
        testDecrease(8.5, 8);
        testDecrease(11, 10);
        testDecrease(11.5, 11);
        testDecrease(12, 11);
        testDecrease(12.5, 12);
        testDecrease(13.5, 12);
        testDecrease(14, 12);
        testDecrease(28, 26);
        testDecrease(28.5, 28);
        testDecrease(36, 28);
        testDecrease(48.5, 48);
        testDecrease(71.5, 48);
        testDecrease(72, 48);
        testDecrease(72.5, 72);
        testDecrease(80, 72);
        testDecrease(80.5, 80);
        testDecrease(90, 80);
    });
});
