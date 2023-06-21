import { areSameFormats } from '../../../lib/domToModel/utils/areSameFormats';

describe('areSameFormats', () => {
    it('empty object', () => {
        const result = areSameFormats({}, {});
        expect(result).toBeTrue();
    });

    it('same object', () => {
        const obj = { a: 'b' };
        const result = areSameFormats(obj, obj);
        expect(result).toBeTrue();
    });

    it('Objects with different sizes 1', () => {
        const result = areSameFormats({ a: 1 }, { a: 1, b: 2 });
        expect(result).toBeFalse();
    });

    it('Objects with different sizes 2', () => {
        const result = areSameFormats({ a: 1, b: 2 }, { a: 1 });
        expect(result).toBeFalse();
    });

    it('Objects with same sizes different order', () => {
        const result = areSameFormats({ a: 1, b: 2 }, { b: 2, a: 1 });
        expect(result).toBeTrue();
    });

    it('Objects with same keys same values', () => {
        const result = areSameFormats({ a: 1, b: 2 }, { a: 1, b: 2 });
        expect(result).toBeTrue();
    });

    it('Objects with same keys different values', () => {
        const result = areSameFormats({ a: 1, b: 2 }, { a: 1, b: 3 });
        expect(result).toBeFalse();
    });

    it('Objects with different keys ', () => {
        const result = areSameFormats({ a: 1, b: 2 }, { a: 1, c: 2 });
        expect(result).toBeFalse();
    });
});
