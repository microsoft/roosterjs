import { stripInvisibleUnicode } from '../../../lib/modelApi/common/stripInvisibleUnicode';

describe('stripInvisibleUnicode', () => {
    it('should strip invisible unicode characters in the tag range', () => {
        expect(stripInvisibleUnicode('a\u{E0041}b\u{E0042}c')).toBe('abc');
    });

    it('should strip all characters when input contains only invisible unicode', () => {
        expect(stripInvisibleUnicode('\u{E0000}\u{E007F}\u{EFFFF}')).toBe('');
    });

    it('should strip characters at range boundaries (U+E0000 and U+EFFFF)', () => {
        expect(stripInvisibleUnicode('\u{DFFFF}start\u{E0000}mid\u{EFFFF}end\u{F0000}')).toBe(
            '\u{DFFFF}startmidend\u{F0000}'
        );
    });

    it('should preserve meaningful invisible characters outside the tag range', () => {
        // U+200B = Zero-Width Space, U+200D = Zero-Width Joiner,
        // U+202E = Right-to-Left Override, U+202C = Pop Directional Formatting
        const text = 'a\u{200B}b\u{200D}c\u{202E}d\u{202C}e';
        expect(stripInvisibleUnicode(text)).toBe(text);
    });

    it('should strip tag-range chars while keeping meaningful invisible chars', () => {
        expect(stripInvisibleUnicode('a\u{200B}\u{E0041}b\u{202E}\u{E0042}c')).toBe(
            'a\u{200B}b\u{202E}c'
        );
    });

    it('should not modify visible characters', () => {
        const text = 'hello world 你好';
        expect(stripInvisibleUnicode(text)).toBe(text);
    });

    it('should return empty string for empty input', () => {
        expect(stripInvisibleUnicode('')).toBe('');
    });

    it('should handle a long sequence of tag characters', () => {
        const tags = Array.from({ length: 100 }, (_, i) => String.fromCodePoint(0xe0000 + i)).join(
            ''
        );
        expect(stripInvisibleUnicode('before' + tags + 'after')).toBe('beforeafter');
    });
});
