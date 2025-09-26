import { isLetterFollowedByMarker } from '../../../lib/autoFormat/list/isLetterFollowedByMarker';

describe('isLetterFollowedByMarker', () => {
    it('should return true for valid letter followed by )', () => {
        expect(isLetterFollowedByMarker('a)')).toBe(true);
        expect(isLetterFollowedByMarker('B)')).toBe(true);
        expect(isLetterFollowedByMarker('z)')).toBe(true);
        expect(isLetterFollowedByMarker('Z)')).toBe(true);
    });

    it('should return true for valid letter followed by .', () => {
        expect(isLetterFollowedByMarker('a.')).toBe(true);
        expect(isLetterFollowedByMarker('B.')).toBe(true);
        expect(isLetterFollowedByMarker('z.')).toBe(true);
        expect(isLetterFollowedByMarker('Z.')).toBe(true);
    });

    it('should return true for valid letter followed by -', () => {
        expect(isLetterFollowedByMarker('a-')).toBe(true);
        expect(isLetterFollowedByMarker('B-')).toBe(true);
        expect(isLetterFollowedByMarker('z-')).toBe(true);
        expect(isLetterFollowedByMarker('Z-')).toBe(true);
    });

    it('should return false for empty or null input', () => {
        expect(isLetterFollowedByMarker('')).toBe(false);
        expect(isLetterFollowedByMarker(null as any)).toBe(false);
        expect(isLetterFollowedByMarker(undefined as any)).toBe(false);
    });

    it('should return false for strings that are too short', () => {
        expect(isLetterFollowedByMarker('a')).toBe(false);
        expect(isLetterFollowedByMarker('.')).toBe(false);
        expect(isLetterFollowedByMarker(')')).toBe(false);
        expect(isLetterFollowedByMarker('-')).toBe(false);
    });

    it('should return false for strings that are too long', () => {
        expect(isLetterFollowedByMarker('ab.')).toBe(false);
        expect(isLetterFollowedByMarker('abc)')).toBe(false);
        expect(isLetterFollowedByMarker('test-')).toBe(false);
    });

    it('should return false for numbers followed by markers', () => {
        expect(isLetterFollowedByMarker('1.')).toBe(false);
        expect(isLetterFollowedByMarker('2)')).toBe(false);
        expect(isLetterFollowedByMarker('9-')).toBe(false);
    });

    it('should return false for letters followed by invalid markers', () => {
        expect(isLetterFollowedByMarker('a!')).toBe(false);
        expect(isLetterFollowedByMarker('b?')).toBe(false);
        expect(isLetterFollowedByMarker('c:')).toBe(false);
        expect(isLetterFollowedByMarker('d;')).toBe(false);
        expect(isLetterFollowedByMarker('e,')).toBe(false);
    });

    it('should return false for special characters followed by markers', () => {
        expect(isLetterFollowedByMarker('*.')).toBe(false);
        expect(isLetterFollowedByMarker('#)')).toBe(false);
        expect(isLetterFollowedByMarker('@-')).toBe(false);
        expect(isLetterFollowedByMarker('$.')).toBe(false);
    });

    it('should return false for mixed cases', () => {
        expect(isLetterFollowedByMarker('1a.')).toBe(false);
        expect(isLetterFollowedByMarker('a1.')).toBe(false);
        expect(isLetterFollowedByMarker('a b.')).toBe(false);
    });
});
