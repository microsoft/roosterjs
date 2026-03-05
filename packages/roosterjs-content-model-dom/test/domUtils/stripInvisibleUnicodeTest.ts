import { stripInvisibleUnicode } from '../../lib/domUtils/stripInvisibleUnicode';

describe('stripInvisibleUnicode', () => {
    it('should return empty string for empty input', () => {
        expect(stripInvisibleUnicode('')).toBe('');
    });

    it('should return the same string when no invisible characters are present', () => {
        expect(stripInvisibleUnicode('mailto:user@example.com')).toBe('mailto:user@example.com');
    });

    it('should return the same string for regular text with no invisible chars', () => {
        expect(stripInvisibleUnicode('Hello World! 123')).toBe('Hello World! 123');
    });

    it('should strip zero-width space (U+200B)', () => {
        expect(stripInvisibleUnicode('mailto:\u200Buser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip zero-width non-joiner (U+200C)', () => {
        expect(stripInvisibleUnicode('mailto:\u200Cuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip zero-width joiner (U+200D)', () => {
        expect(stripInvisibleUnicode('mailto:\u200Duser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip left-to-right mark (U+200E)', () => {
        expect(stripInvisibleUnicode('mailto:\u200Euser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip right-to-left mark (U+200F)', () => {
        expect(stripInvisibleUnicode('mailto:\u200Fuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip BOM / zero-width no-break space (U+FEFF)', () => {
        expect(stripInvisibleUnicode('\uFEFFmailto:user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip soft hyphen (U+00AD)', () => {
        expect(stripInvisibleUnicode('mailto:us\u00ADer@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip bidirectional override characters (U+202A-U+202E)', () => {
        expect(stripInvisibleUnicode('mailto:\u202Auser\u202E@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip bidirectional isolate characters (U+2066-U+2069)', () => {
        expect(stripInvisibleUnicode('mailto:\u2066user\u2069@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip word joiner (U+2060)', () => {
        expect(stripInvisibleUnicode('mailto:\u2060user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Arabic letter mark (U+061C)', () => {
        expect(stripInvisibleUnicode('mailto:\u061Cuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip combining grapheme joiner (U+034F)', () => {
        expect(stripInvisibleUnicode('mailto:\u034Fuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Mongolian vowel separator (U+180E)', () => {
        expect(stripInvisibleUnicode('mailto:\u180Euser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip line separator (U+2028) and paragraph separator (U+2029)', () => {
        expect(stripInvisibleUnicode('mailto:\u2028user\u2029@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Unicode Tags (U+E0001-U+E007F) - supplementary plane', () => {
        // U+E0061 = surrogate pair \uDB40\uDC61 (Tag Latin Small Letter A)
        // U+E0062 = surrogate pair \uDB40\uDC62 (Tag Latin Small Letter B)
        expect(stripInvisibleUnicode('mailto:\uDB40\uDC61\uDB40\uDC62user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Unicode Tag Begin (U+E0001)', () => {
        // U+E0001 = surrogate pair \uDB40\uDC01
        expect(stripInvisibleUnicode('mailto:\uDB40\uDC01user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Unicode Tag Cancel (U+E007F)', () => {
        // U+E007F = surrogate pair \uDB40\uDC7F
        expect(stripInvisibleUnicode('mailto:\uDB40\uDC7Fuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip multiple different invisible characters in one string', () => {
        expect(
            stripInvisibleUnicode(
                'mailto:\u200B\u200C\u200D\u200E\u200F\u202A\u202E\uFEFFuser@example.com'
            )
        ).toBe('mailto:user@example.com');
    });

    it('should return empty string when input contains only invisible characters', () => {
        expect(stripInvisibleUnicode('\u200B\u200C\u200D\uFEFF')).toBe('');
    });

    it('should handle invisible characters scattered throughout a mailto link', () => {
        expect(
            stripInvisibleUnicode('m\u200Ba\u200Ci\u200Dl\u200Et\u200Fo\u202A:user@example.com')
        ).toBe('mailto:user@example.com');
    });

    it('should strip invisible characters from mailto subject parameter', () => {
        expect(
            stripInvisibleUnicode(
                'mailto:user@example.com?subject=Hello\u200B\u200CWorld&body=Test\u200DContent'
            )
        ).toBe('mailto:user@example.com?subject=HelloWorld&body=TestContent');
    });

    it('should handle http links with invisible characters', () => {
        expect(stripInvisibleUnicode('https://www\u200B.example\u200C.com')).toBe(
            'https://www.example.com'
        );
    });

    it('should not strip regular visible Unicode characters', () => {
        // Common non-ASCII visible chars should be preserved
        expect(stripInvisibleUnicode('mailto:über@example.com')).toBe('mailto:über@example.com');
        expect(stripInvisibleUnicode('mailto:用户@example.com')).toBe('mailto:用户@example.com');
        expect(stripInvisibleUnicode('mailto:пользователь@example.com')).toBe(
            'mailto:пользователь@example.com'
        );
    });

    it('should preserve emoji characters', () => {
        expect(stripInvisibleUnicode('mailto:user@example.com?subject=Hello 👋')).toBe(
            'mailto:user@example.com?subject=Hello 👋'
        );
    });

    it('should strip Hangul fillers', () => {
        expect(stripInvisibleUnicode('mailto:\u115F\u1160\u3164\uFFA0user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Khmer vowel inherent characters', () => {
        expect(stripInvisibleUnicode('mailto:\u17B4\u17B5user@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip Mongolian free variation selectors (U+180B-U+180D)', () => {
        expect(stripInvisibleUnicode('mailto:\u180B\u180C\u180Duser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip interlinear annotation anchors (U+FFF9-U+FFFB)', () => {
        expect(stripInvisibleUnicode('mailto:\uFFF9\uFFFA\uFFFBuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip extended Unicode Tags beyond U+E007F (U+E0080-U+E00FF)', () => {
        // U+E0080 = surrogate pair \uDB40\uDC80
        // U+E00FF = surrogate pair \uDB40\uDCFF
        expect(stripInvisibleUnicode('mailto:\uDB40\uDC80\uDB40\uDCFFuser@example.com')).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip URL-encoded zero-width space (%E2%80%8B = U+200B)', () => {
        const link = 'mailto:%E2%80%8Buser@example.com';
        expect(stripInvisibleUnicode(link)).toBe('mailto:user@example.com');
    });

    it('should strip URL-encoded bidirectional override (%E2%80%AE = U+202E)', () => {
        const link = 'mailto:%E2%80%AEuser@example.com';
        expect(stripInvisibleUnicode(link)).toBe('mailto:user@example.com');
    });

    it('should strip mixed raw and URL-encoded invisible characters', () => {
        const link = 'mailto:\u200B%E2%80%8Cuser@example.com';
        expect(stripInvisibleUnicode(link)).toBe('mailto:user@example.com');
    });

    it('should handle malformed percent-encoding gracefully', () => {
        const link = 'mailto:%E2%80user@example.com';
        expect(stripInvisibleUnicode(link)).toBe('mailto:%E2%80user@example.com');
    });

    it('should strip URL-encoded invisible chars from mailto subject and body', () => {
        const link =
            'mailto:user@example.com?subject=Hello%E2%80%8BWorld&body=Test%E2%80%8CContent';
        expect(stripInvisibleUnicode(link)).toBe(
            'mailto:user@example.com?subject=HelloWorld&body=TestContent'
        );
    });
});
