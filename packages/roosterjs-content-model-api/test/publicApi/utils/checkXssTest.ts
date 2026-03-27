import { checkXss } from '../../../lib/publicApi/utils/checkXss';

describe('checkXss', () => {
    it('No XSS', () => {
        const link = 'https://example.com';
        expect(checkXss(link)).toBe(link);
    });

    it('With XSS', () => {
        const link = 's\nc\nr\ni\np\nt:https://example.com';
        expect(checkXss(link)).toBe('');
    });

    it('With mixed case XSS', () => {
        const link = 'S\nC\nr\ni\nP\nt:https://example.com';
        expect(checkXss(link)).toBe('');
    });

    it('With no XSS but similar pattern', () => {
        const link = 'scripting:https://example.com';
        expect(checkXss(link)).toBe(link);
    });

    it('With potential XSS', () => {
        const link = 'script:https://example.com';
        expect(checkXss(link)).toBe('');
    });

    it('With script but it is safe', () => {
        const link = 'https://example.com/script:.js';
        expect(checkXss(link)).toBe(link);
    });

    it('should strip invisible Unicode from link', () => {
        const link = 'https://www\u200B.example\u200C.com';
        expect(checkXss(link)).toBe('https://www.example.com');
    });

    it('should strip invisible Unicode from mailto link', () => {
        const link = 'mailto:\u200Buser@example.com';
        expect(checkXss(link)).toBe('mailto:user@example.com');
    });

    it('should detect XSS hidden behind invisible Unicode in script:', () => {
        // script: with zero-width spaces between characters should still be caught
        const link = 's\u200Bc\u200Cr\u200Di\u200Ep\u200Ft:alert(1)';
        expect(checkXss(link)).toBe('');
    });

    it('should strip Unicode Tags (supplementary plane) from link', () => {
        // U+E0061 = \uDB40\uDC61 (Tag Latin Small Letter A)
        const link = 'mailto:\uDB40\uDC61user@example.com';
        expect(checkXss(link)).toBe('mailto:user@example.com');
    });

    it('should strip bidirectional marks from link', () => {
        const link = 'mailto:\u202Auser\u202E@example.com';
        expect(checkXss(link)).toBe('mailto:user@example.com');
    });

    it('should strip invisible Unicode from mailto subject and body', () => {
        const link = 'mailto:user@example.com?subject=Hello\u200BWorld&body=Test\u200CContent';
        expect(checkXss(link)).toBe('mailto:user@example.com?subject=HelloWorld&body=TestContent');
    });
});
