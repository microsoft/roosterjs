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

    it('shallow clone segment format for block', () => {
        const context = createDomToModelContext();

        context.segmentFormat.fontSize = '20px';
        context.segmentFormat.textColor = 'red';
        context.segmentFormat.backgroundColor = 'green';

        stackFormat(context, { segment: 'shallowCloneForBlock' }, () => {
            expect(context.segmentFormat).toEqual({
                fontSize: '20px',
                textColor: 'red',
            });

            context.segmentFormat.fontSize = '40px';
        });
        expect(context.segmentFormat).toEqual({
            fontSize: '20px',
            textColor: 'red',
            backgroundColor: 'green',
        });
    });
});
