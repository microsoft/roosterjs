import { parseWordLigatures } from '../../../lib/paste/parsers/wordLigatureParser';
import { getWordLigatureRules } from '../../../lib/paste/WordDesktop/getWordLigatureRules';

describe('parseWordLigatures', () => {
    it('reads declarations after ordinary rules and across multiple stylesheets', () => {
        expect(
            getWordLigatureRules(
                '<style>.Ignored{color:red}.First{mso-ligatures:none}' +
                    '.Second{mso-ligatures:standardcontextual}</style>' +
                    '<style>.Third{mso-ligatures:all}</style>',
                document
            )
        ).toEqual([
            { selector: '.First', value: 'none' },
            { selector: '.Second', value: 'standardcontextual' },
            { selector: '.Third', value: 'all' },
        ]);
        expect(getWordLigatureRules('', document)).toEqual([]);
    });

    it('disables flags absent from a supplied Word feature mask', () => {
        expect(parseWordLigatures('standardcontextual')).toBe(
            '"liga" 1, "clig" 1, "hlig" 0, "dlig" 0'
        );
        expect(parseWordLigatures('discretionary')).toBe('"liga" 0, "clig" 0, "hlig" 0, "dlig" 1');
    });

    it('handles Word all and none without substituting browser defaults', () => {
        expect(parseWordLigatures('all')).toBe('"liga" 1, "clig" 1, "hlig" 1, "dlig" 1');
        expect(parseWordLigatures('none')).toBe('"liga" 0, "clig" 0, "hlig" 0, "dlig" 0');
    });

    it('does not infer flags from invalid keywords or token order', () => {
        expect(parseWordLigatures('unknown')).toBeUndefined();
        expect(parseWordLigatures('contextualstandard')).toBeUndefined();
        expect(parseWordLigatures('')).toBeUndefined();
    });
});
