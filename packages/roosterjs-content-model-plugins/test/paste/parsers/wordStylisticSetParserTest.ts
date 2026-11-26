import { parseWordStylisticSet } from '../../../lib/paste/parsers/wordStylisticSetParser';

describe('parseWordStylisticSet', () => {
    it('accepts the native default and single-bit set values', () => {
        expect(parseWordStylisticSet('0')).toBe(0);
        expect(parseWordStylisticSet(' 4 ')).toBe(4);
        expect(parseWordStylisticSet('524288')).toBe(524288);
    });
    it('does not reinterpret multi-bit masks or malformed values as set numbers', () => {
        ['3', '20', '-1', '1.5', '1048576', '1e2', 'unknown', ''].forEach(value => {
            expect(parseWordStylisticSet(value)).toBeUndefined();
        });
    });
});
