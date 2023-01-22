import { isCssVariable, processCssVariable } from '../../lib/style/processCssVariable';

describe('processCssVariable', () => {
    it('no var', () => {
        const result = processCssVariable('test');
        expect(result).toBe(null);
    });

    it('var without fallback', () => {
        const result = processCssVariable('var(--test)');
        expect(result![1]).toBe('--test');
        expect(result![2]).toBe(undefined!);
    });

    it('var with fallback', () => {
        const result = processCssVariable('var(--test, fallback)');
        expect(result![1]).toBe('--test');
        expect(result![2]).toBe('fallback');
    });

    it('var with fallback that has complex value', () => {
        const result = processCssVariable('var(--test, rgb(1, 2, 3))');
        expect(result![1]).toBe('--test');
        expect(result![2]).toBe('rgb(1, 2, 3)');
    });

    it('var with fallback and more spaces', () => {
        const result = processCssVariable('var(    --test    ,   aa bb  cc   )');
        expect(result![1]).toBe('--test');
        expect(result![2]).toBe('aa bb  cc   ');
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
