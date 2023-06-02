import { transformTabCharacters } from '../../lib/clipboard/handleTextPaste';

describe('transformTabCharacters', () => {
    it('no \t', () => {
        const input = 'hello world';
        expect(transformTabCharacters(input)).toBe(input);
    });

    it('1 \t', () => {
        const input = '\tHello';
        expect(transformTabCharacters(input)).toBe('      Hello');
    });

    it('complex', () => {
        const input = '1\t234\t5';
        expect(transformTabCharacters(input)).toBe('1     234   5');
    });
});
