import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { stackFormat } from '../../../lib/modelToDom/utils/stackFormat';

describe('stackFormat', () => {
    it('no tag', () => {
        const context = createModelToDomContext();
        const format = {
            fontSize: '10px',
        };
        const callback = jasmine.createSpy().and.callFake(() => {
            expect(context.implicitFormat).toBe(format);
        });

        context.implicitFormat = format;

        stackFormat(context, null, callback);

        expect(callback).toHaveBeenCalled();
        expect(context.implicitFormat).toEqual({
            fontSize: '10px',
        });
    });

    it('has a tag', () => {
        const context = createModelToDomContext();
        const callback = jasmine.createSpy().and.callFake(() => {
            expect(context.implicitFormat).toEqual({
                underline: true,
            });
            context.implicitFormat.fontSize = '10px';
        });

        stackFormat(context, 'a', callback);

        expect(callback).toHaveBeenCalled();
        expect(context.implicitFormat).toEqual({});
    });

    it('has a tag and throw', () => {
        const context = createModelToDomContext();
        const callback = jasmine.createSpy().and.callFake(() => {
            expect(context.implicitFormat).toEqual({
                underline: true,
            });
            context.implicitFormat.fontSize = '10px';
            throw new Error('test');
        });

        const func = () => stackFormat(context, 'a', callback);

        expect(func).toThrow();
        expect(callback).toHaveBeenCalled();
        expect(context.implicitFormat).toEqual({});
    });
});
