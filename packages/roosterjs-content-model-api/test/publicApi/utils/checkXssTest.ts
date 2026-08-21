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
});
