import { stripInvisibleUnicode } from '../../../lib/modelApi/common/stripInvisibleUnicode';

describe('stripInvisibleUnicode', () => {
    it('should strip invisible unicode characters in the tag range', () => {
        expect(stripInvisibleUnicode('a\u{E0041}b\u{E0042}c')).toBe('abc');
    });

    it('should strip all characters when input contains only invisible unicode', () => {
        expect(stripInvisibleUnicode('\u{E0000}\u{E0041}\u{E007F}')).toBe('');
    });

    it('should strip characters at range boundaries (U+E0000 and U+E007F)', () => {
        expect(stripInvisibleUnicode('\u{DFFFF}start\u{E0000}mid\u{E007F}end\u{E0080}')).toBe(
            '\u{DFFFF}startmidend\u{E0080}'
        );
    });

    it('should preserve characters above the tag range, including variation selectors', () => {
        const text = '\u{E0080}\u{E0100}\u{E01EF}\u{EFFFF}\u{F0000}';
        expect(stripInvisibleUnicode(text)).toBe(text);
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

    it('should strip every character in the tag range', () => {
        const tags = Array.from({ length: 128 }, (_, i) => String.fromCodePoint(0xe0000 + i)).join(
            ''
        );
        expect(stripInvisibleUnicode('before' + tags + 'after')).toBe('beforeafter');
    });
});
