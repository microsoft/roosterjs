import { isLastWordUrl } from '../../../lib/autoFormat/link/isLastWordUrl';

describe('isLastWordUrl', () => {
    it('should return true for valid HTTP URLs as last word', () => {
        expect(isLastWordUrl('Check out https://example.com')).toBe(true);
        expect(isLastWordUrl('Visit https://www.google.com')).toBe(true);
        expect(isLastWordUrl('Go to http://localhost:3000')).toBe(true);
        expect(isLastWordUrl('https://github.com')).toBe(true);
    });

    it('should return true for valid HTTPS URLs as last word', () => {
        expect(isLastWordUrl('Check https://secure.example.com')).toBe(true);
        expect(isLastWordUrl('Visit https://api.github.com/users')).toBe(true);
        expect(isLastWordUrl('https://example.com/path?query=value')).toBe(true);
    });

    it('should return true for www URLs as last word', () => {
        expect(isLastWordUrl('Visit www.example.com')).toBe(true);
        expect(isLastWordUrl('Go to www.google.com')).toBe(true);
        expect(isLastWordUrl('Check www.github.com')).toBe(true);
    });

    it('should return true for FTP URLs as last word', () => {
        expect(isLastWordUrl('Download from ftp://files.example.com')).toBe(true);
        expect(isLastWordUrl('ftp://ftp.gnu.org/gnu')).toBe(true);
    });

    it('should return true for mailto URLs as last word', () => {
        expect(isLastWordUrl('Contact mailto:test@example.com')).toBe(true);
        expect(isLastWordUrl('Email mailto:support@company.com')).toBe(true);
    });

    it('should return true for tel URLs as last word', () => {
        expect(isLastWordUrl('Call tel:+1234567890')).toBe(true);
        expect(isLastWordUrl('Phone tel:555-0123')).toBe(true);
    });

    it('should return false for empty or null input', () => {
        expect(isLastWordUrl('')).toBe(false);
        expect(isLastWordUrl(null as any)).toBe(false);
        expect(isLastWordUrl(undefined as any)).toBe(false);
    });

    it('should return false when last word is not a URL', () => {
        expect(isLastWordUrl('This is normal text')).toBe(false);
        expect(isLastWordUrl('No URL here word')).toBe(false);
        expect(isLastWordUrl('Just a sentence')).toBe(false);
    });

    it('should return false when URL is not the last word', () => {
        expect(isLastWordUrl('Visit https://example.com today')).toBe(false);
        expect(isLastWordUrl('Check www.google.com for more info')).toBe(false);
        expect(isLastWordUrl('Email mailto:test@example.com now')).toBe(false);
    });

    it('should return false for incomplete URLs', () => {
        expect(isLastWordUrl('Just http')).toBe(false);
        expect(isLastWordUrl('Only https')).toBe(false);
        expect(isLastWordUrl('Just www')).toBe(false);
        expect(isLastWordUrl('Only ftp')).toBe(false);
    });

    it('should return false for URLs with spaces', () => {
        expect(isLastWordUrl('https://example .com')).toBe(false);
        expect(isLastWordUrl('www.example .com')).toBe(false);
    });

    it('should handle URLs with complex paths and parameters', () => {
        expect(
            isLastWordUrl('Visit https://example.com/path/to/resource?param1=value1&param2=value2')
        ).toBe(true);
        expect(isLastWordUrl('Check www.example.com/search?q=test&type=all')).toBe(true);
    });

    it('should handle single word URLs', () => {
        expect(isLastWordUrl('https://example.com')).toBe(true);
        expect(isLastWordUrl('www.google.com')).toBe(true);
        expect(isLastWordUrl('mailto:test@example.com')).toBe(true);
    });

    it('should be case insensitive for protocol', () => {
        expect(isLastWordUrl('Visit HTTPS://EXAMPLE.COM')).toBe(true);
        expect(isLastWordUrl('Go to HTTP://LOCALHOST')).toBe(true);
        expect(isLastWordUrl('Email MAILTO:TEST@EXAMPLE.COM')).toBe(true);
    });
});
