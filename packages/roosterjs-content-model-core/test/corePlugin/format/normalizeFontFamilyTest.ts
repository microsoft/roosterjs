import { normalizeFontFamily } from '../../../lib/corePlugin/format/normalizeFontFamily';

describe('normalizeFontFamily', () => {
    it('empty string', () => {
        expect(normalizeFontFamily('')).toBe('');
    });

    it('single font family', () => {
        expect(normalizeFontFamily('Arial')).toBe('Arial');
    });

    it('multiple font families', () => {
        expect(normalizeFontFamily('Arial, Helvetica, sans-serif')).toBe(
            'Arial, Helvetica, sans-serif'
        );
    });

    it('font family with spaces', () => {
        expect(normalizeFontFamily('Arial Black, Arial Narrow, sans-serif')).toBe(
            '"Arial Black", "Arial Narrow", sans-serif'
        );
    });
    it('font family with special characters', () => {
        expect(normalizeFontFamily('Arial, "Times New Roman", sans-serif')).toBe(
            'Arial, "Times New Roman", sans-serif'
        );
    });

    it('font family with quotes', () => {
        expect(normalizeFontFamily('"Arial Black", Arial Narrow, sans-serif')).toBe(
            '"Arial Black", "Arial Narrow", sans-serif'
        );
    });

    it('font family with mixed quotes', () => {
        expect(normalizeFontFamily('"Arial Black", Arial Narrow, "sans-serif"')).toBe(
            '"Arial Black", "Arial Narrow", "sans-serif"'
        );
    });

    it('font family with commas', () => {
        expect(normalizeFontFamily('Arial, Helvetica, "Times, New Roman", sans-serif')).toBe(
            'Arial, Helvetica, "Times, New Roman", sans-serif'
        );
    });

    it('font family with non-alphanumeric characters', () => {
        expect(normalizeFontFamily('Arial, Helvetica, sans-serif, "Comic Sans MS"')).toBe(
            'Arial, Helvetica, sans-serif, "Comic Sans MS"'
        );
    });

    it('font family with leading and trailing spaces', () => {
        expect(normalizeFontFamily('  Arial  ,  Helvetica  ,  sans-serif  ')).toBe(
            'Arial, Helvetica, sans-serif'
        );
    });

    it('font family with multiple spaces', () => {
        expect(normalizeFontFamily('Arial  ,  Helvetica  ,  sans-serif')).toBe(
            'Arial, Helvetica, sans-serif'
        );
    });

    it('font family with special characters and spaces', () => {
        expect(normalizeFontFamily('Arial Black, "Times New Roman", sans-serif')).toBe(
            '"Arial Black", "Times New Roman", sans-serif'
        );
    });

    it('font family with special characters and quotes', () => {
        expect(normalizeFontFamily('"Arial Black", "Times New Roman", sans-serif')).toBe(
            '"Arial Black", "Times New Roman", sans-serif'
        );
    });

    it('font family with special characters and mixed quotes', () => {
        expect(normalizeFontFamily('"Arial Black", Arial Narrow, "sans-serif"')).toBe(
            '"Arial Black", "Arial Narrow", "sans-serif"'
        );
    });

    it('font family with special characters and commas', () => {
        expect(normalizeFontFamily('Arial, Helvetica, "Times, New Roman", sans-serif')).toBe(
            'Arial, Helvetica, "Times, New Roman", sans-serif'
        );
    });

    it('font family with special characters and non-alphanumeric characters', () => {
        expect(normalizeFontFamily('Arial, Helvetica, sans-serif, "Comic Sans MS"')).toBe(
            'Arial, Helvetica, sans-serif, "Comic Sans MS"'
        );
    });

    it('font family with special characters and leading and trailing spaces', () => {
        expect(normalizeFontFamily('  Arial  ,  Helvetica  ,  sans-serif  ')).toBe(
            'Arial, Helvetica, sans-serif'
        );
    });

    it('font family with special characters and multiple spaces', () => {
        expect(normalizeFontFamily('Arial  ,  Helvetica  ,  sans-serif')).toBe(
            'Arial, Helvetica, sans-serif'
        );
    });

    it('font family with special characters and special characters and spaces', () => {
        expect(normalizeFontFamily('Arial Black, "Times New Roman", sans-serif')).toBe(
            '"Arial Black", "Times New Roman", sans-serif'
        );
    });

    it('font family with special characters and special characters and quotes', () => {
        expect(normalizeFontFamily('"Arial Black", "Times New Roman", sans-serif')).toBe(
            '"Arial Black", "Times New Roman", sans-serif'
        );
    });

    it('font family with special characters and special characters and mixed quotes', () => {
        expect(normalizeFontFamily('"Arial Black", Arial Narrow, "sans-serif"')).toBe(
            '"Arial Black", "Arial Narrow", "sans-serif"'
        );
    });

    it('font family with dots', () => {
        expect(normalizeFontFamily('A.B')).toBe('"A.B"');
    });
});
