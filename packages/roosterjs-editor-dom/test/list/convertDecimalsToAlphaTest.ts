import convertDecimalsToAlpha from '../../lib/list/convertDecimalsToAlpha';

describe('convertDecimalsToAlpha', () => {
    function runTest(decimals: number, expectedResult: string, isLowerCase?: boolean) {
        const alpha = convertDecimalsToAlpha(decimals, isLowerCase);
        expect(alpha).toBe(expectedResult);
    }

    it('should convert 5 to f', () => {
        runTest(5, 'f', true);
    });

    it('should convert 6 to G', () => {
        runTest(6, 'G');
    });

    it('should convert 27 to AA', () => {
        runTest(27, 'AB');
    });

    it('should convert 52 to ba', () => {
        runTest(52, 'ba', true);
    });
});
