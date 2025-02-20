import { isMarkdownTable } from '../../../lib/markdownToModel/utils/isMarkdownTable';

describe('isMarkdownTable', () => {
    function runTest(text: string, expected: boolean) {
        // Act
        const result = isMarkdownTable(text);

        // Assert
        expect(result).toBe(expected);
    }

    it('should return false for empty text', () => {
        runTest('', false);
    });

    it('should return false for text', () => {
        runTest('text without table', false);
    });

    it('should return true for table with one column', () => {
        runTest('|-----|', true);
    });

    it('should return true for text with table', () => {
        runTest(`|-----|----|`, true);
    });

    it('should return true for alignments', () => {
        runTest(`|:---|:----:|----:|----|`, true);
    });
});
