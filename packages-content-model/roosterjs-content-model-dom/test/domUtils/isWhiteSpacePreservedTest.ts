import { isWhiteSpacePreserved } from '../../lib/domUtils/isWhiteSpacePreserved';

describe('isWhiteSpacePreserved', () => {
    function runTest(style: string | undefined, expected: boolean) {
        const result = isWhiteSpacePreserved(style);
        expect(result).toBe(expected);
    }

    it('isWhiteSpacePreserved', () => {
        runTest(undefined, false);
        runTest('normal', false);
        runTest('nowrap', false);
        runTest('pre', true);
        runTest('pre-wrap', true);
        runTest('pre-line', false);
        runTest('break-spaces', true);
    });
});
