import { divParagraphSanitizer } from '../../../lib/paste/DefaultSanitizers';

divParagraphSanitizer;

describe('divParagraphSanitizer', () => {
    it('handle div', () => {
        const result = divParagraphSanitizer('100px', 'div');
        expect(result).toBeNull();
    });
    it('handle p', () => {
        const result = divParagraphSanitizer('100px', 'p');
        expect(result).toBeNull();
    });
    it('handle image', () => {
        const result = divParagraphSanitizer('100px', 'image');
        expect(result).toEqual('100px');
    });
});
