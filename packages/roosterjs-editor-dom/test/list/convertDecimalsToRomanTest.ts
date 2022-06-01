import convertDecimalsToRoman from '../../lib/list/convertDecimalsToRomans';

describe('convertDecimalsToRoman', () => {
    function runTest(decimals: number, expectedResult: string, isLowerCase?: boolean) {
        const romanNumber = convertDecimalsToRoman(decimals, isLowerCase);
        expect(romanNumber).toBe(expectedResult);
    }

    it('should convert 5 to v', () => {
        runTest(5, 'v', true);
    });

    it('should convert 6 to VI', () => {
        runTest(6, 'VI');
    });

    it('should convert 20 to XX', () => {
        runTest(20, 'XX');
    });

    it('should convert 16 to xvi', () => {
        runTest(16, 'xvi', true);
    });
});
