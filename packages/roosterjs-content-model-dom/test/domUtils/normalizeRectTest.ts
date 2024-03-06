import { normalizeRect } from '../../lib/domUtils/normalizeRect';

describe('normalizeRect', () => {
    it('valid rect - all have positive values', () => {
        const rect: DOMRect = {
            left: 1,
            right: 2,
            top: 3,
            bottom: 4,
        } as any;

        const result = normalizeRect(rect);

        expect(result).toEqual({
            left: 1,
            right: 2,
            top: 3,
            bottom: 4,
        });
    });

    it('valid rect - some have 0 values', () => {
        const rect: DOMRect = {
            left: 1,
            right: 0,
            top: 0,
            bottom: 0,
        } as any;

        const result = normalizeRect(rect);

        expect(result).toEqual({
            left: 1,
            right: 2,
            top: 3,
            bottom: 4,
        });
    });

    it('invalid rect', () => {
        const rect: DOMRect = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        } as any;

        const result = normalizeRect(rect);

        expect(result).toBeNull();
    });
});
