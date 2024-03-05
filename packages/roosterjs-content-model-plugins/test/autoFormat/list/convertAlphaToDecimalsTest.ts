import { convertAlphaToDecimals } from '../../../lib/autoFormat/list/convertAlphaToDecimals';

describe('convertAlphaToDecimals', () => {
    function runTest(alpha: string, expectedResult: number) {
        const decimal = convertAlphaToDecimals(alpha);
        expect(decimal).toBe(expectedResult);
    }

    it('should convert a to 1', () => {
        runTest('a', 1);
    });

    it('should convert G to 6', () => {
        runTest('G', 7);
    });

    it('should convert AA to 27', () => {
        runTest('AA', 27);
    });

    it('should convert ba to 52', () => {
        runTest('ba', 53);
    });
});
