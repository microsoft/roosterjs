import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { stackSegmentFormat } from '../../../lib/domToModel/utils/stackSegmentFormat';

describe('stackSegmentFormat', () => {
    it('stackSegmentFormat', () => {
        const context = createDomToModelContext();
        context.segmentFormat = { a: 1 } as any;
        stackSegmentFormat(context, () => {
            expect(context.segmentFormat).toEqual({ a: 1 } as any);
            (<any>context.segmentFormat).a = 2;
        });
        expect(context.segmentFormat).toEqual({ a: 1 } as any);
    });
});
