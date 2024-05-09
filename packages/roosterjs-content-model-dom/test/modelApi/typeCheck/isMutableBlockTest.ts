import { isMutableBlock } from '../../../lib/modelApi/typeCheck/isMutableBlock';

describe('isMutableBlock', () => {
    it('mutable', () => {
        const mutable = {} as any;
        const result = isMutableBlock(mutable);

        expect(result).toBeTrue();
    });

    it('immutable', () => {
        const mutable = {
            cachedElement: {},
        } as any;
        const result = isMutableBlock(mutable);

        expect(result).toBeFalse();
    });
});
