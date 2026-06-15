import { isContentMarkdown } from '../../lib/publicApi/isContentMarkdown';

describe('isContentMarkdown', () => {
    function runTest(text: string, expected: boolean) {
        expect(isContentMarkdown(text)).toBe(expected);
    }

    it('should return false for empty text', () => {
        runTest('', false);
    });

    it('should return false for whitespace-only text', () => {
        runTest('   \n\t  ', false);
    });

    it('should return false for plain text with no markup', () => {
        runTest('Hello world, this is plain text.', false);
    });

    it('should return false for plain multi-line text', () => {
        runTest('First line\nSecond line\nThird line', false);
    });

    it('should detect heading (h1)', () => {
        runTest('# Heading', true);
    });

    it('should detect heading (h6)', () => {
        runTest('###### Heading', true);
    });

    it('should not treat a hashtag without a space as a heading', () => {
        runTest('#hashtag', false);
    });

    it('should not treat 7 hashes as a heading', () => {
        runTest('####### too many', false);
    });

    it('should detect blockquote', () => {
        runTest('> quoted text', true);
    });

    it('should detect unordered list with dash', () => {
        runTest('- item 1\n- item 2', true);
    });

    it('should detect unordered list with asterisk', () => {
        runTest('* item 1', true);
    });

    it('should detect unordered list with plus', () => {
        runTest('+ item 1', true);
    });

    it('should detect ordered list', () => {
        runTest('1. first\n2. second', true);
    });

    it('should detect horizontal rule', () => {
        runTest('---', true);
    });

    it('should detect table row', () => {
        runTest('| col1 | col2 |', true);
    });

    it('should detect bold text', () => {
        runTest('this is **bold** text', true);
    });

    it('should detect italic text', () => {
        runTest('this is *italic* text', true);
    });

    it('should not treat double asterisks at line start with no closing as bold', () => {
        runTest('** not bold', false);
    });

    it('should detect strikethrough', () => {
        runTest('this is ~~struck~~ text', true);
    });

    it('should detect link', () => {
        runTest('see [docs](https://example.com) for info', true);
    });

    it('should detect image', () => {
        runTest('an ![alt](https://example.com/img.png) image', true);
    });

    it('should detect markdown when it appears on a later line', () => {
        runTest('plain text first line\n# heading on second line', true);
    });

    it('should not be confused by lone asterisks', () => {
        runTest('a * b * c', false);
    });

    it('should not be confused by lone tilde', () => {
        runTest('value ~ approx', false);
    });

    it('should not match a list pattern without trailing content', () => {
        runTest('-', false);
    });
});
