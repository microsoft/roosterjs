import convertAlphaToDecimals from '../../../../lib/plugins/ContentEdit/utils/convertAlphaToDecimals';

describe('convertAlphaToDecimals ', () => {
    function runTest(letter: string, expectedNumber: number) {
        const decimal = convertAlphaToDecimals(letter);
        expect(decimal).toEqual(expectedNumber);
    }

    it('A', () => {
        runTest('A', 1);
    });

    it('AA', () => {
        runTest('AA', 27);
    });

    it('Z', () => {
        runTest('Z', 26);
    });

    it('AB', () => {
        runTest('AB', 28);
    });
});
