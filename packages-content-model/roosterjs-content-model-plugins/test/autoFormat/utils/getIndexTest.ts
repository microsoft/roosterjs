import getIndex from '../../../lib/autoFormat/utils/getIndex';

describe('getIndex', () => {
    function runTest(listMarker: string, expectedResult: number) {
        const index = getIndex(listMarker);
        expect(index).toBe(expectedResult);
    }

    it('should convert a. to 1', () => {
        runTest('a.', 1);
    });

    it('should convert 4. to 4', () => {
        runTest('4.', 4);
    });

    it('should convert (5) to 5', () => {
        runTest('(5)', 5);
    });

    it('should convert (B) to 2', () => {
        runTest('(B)', 2);
    });

    it('should convert g) to 7', () => {
        runTest('g)', 7);
    });

    it('should convert C) to 3', () => {
        runTest('C)', 3);
    });
});
