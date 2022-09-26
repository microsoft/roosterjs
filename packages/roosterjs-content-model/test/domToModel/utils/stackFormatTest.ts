import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { stackFormat } from '../../../lib/domToModel/utils/stackFormat';

describe('stackFormat', () => {
    it('shallow clone segment format', () => {
        const context = createDomToModelContext();
        context.segmentFormat = { a: 1 } as any;
        stackFormat(context, { segment: 'shallowClone' }, () => {
            expect(context.segmentFormat).toEqual({ a: 1 } as any);
            (<any>context.segmentFormat).a = 2;
        });
        expect(context.segmentFormat).toEqual({ a: 1 } as any);
    });

    it('clear segment format', () => {
        const context = createDomToModelContext();
        context.segmentFormat = { a: 1 } as any;
        stackFormat(context, { segment: 'empty' }, () => {
            expect(context.segmentFormat).toEqual({});
            (<any>context.segmentFormat).a = 2;
        });
        expect(context.segmentFormat).toEqual({ a: 1 } as any);
    });

    it('delete list format', () => {
        const context = createDomToModelContext();
        context.listFormat.listParent = { a: 1 } as any;
        stackFormat(context, { list: 'delete' }, () => {
            expect(context.listFormat.listParent).toBeUndefined();
        });
        expect(context.listFormat.listParent).toEqual({ a: 1 } as any);
    });

    it('deep clone list format', () => {
        const context = createDomToModelContext();
        context.listFormat.listParent = { a: { b: 1 } } as any;
        stackFormat(context, { list: 'deepClone' }, () => {
            expect(context.listFormat.listParent).toEqual({ a: { b: 1 } } as any);
            (<any>context.listFormat.listParent).a.b = 2;
        });
        expect(context.listFormat.listParent).toEqual({ a: { b: 1 } } as any);
    });
});
