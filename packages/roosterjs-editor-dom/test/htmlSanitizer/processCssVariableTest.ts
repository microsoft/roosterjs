import { isCssVariable, processCssVariable } from '../../lib/htmlSanitizer/processCssVariable';

describe('processCssVariable', () => {
    it('no var', () => {
        const result = processCssVariable('test');
        expect(result).toBe('');
    });

    it('var without fallback', () => {
        const result = processCssVariable('var(--test)');
        expect(result).toBe('');
    });

    it('var with fallback', () => {
        const result = processCssVariable('var(--test, fallback)');
        expect(result).toBe('fallback');
    });

    it('var with fallback that has complex value', () => {
        const result = processCssVariable('var(--test, rgb(1, 2, 3))');
        expect(result).toBe('rgb(1, 2, 3)');
    });

    it('var with fallback and more spaces', () => {
        const result = processCssVariable('var(    --test    ,   aa bb  cc   )');
        expect(result).toBe('aa bb  cc   ');
    });
});

describe('isCssVariable', () => {
    it('no var', () => {
        const result = isCssVariable('test');
        expect(result).toBeFalse();
    });

    it('var', () => {
        const result = isCssVariable('var(');
        expect(result).toBeTrue();
    });
});
