import { UndeletableFormat } from 'roosterjs-content-model-types';
import { undeletableLinkFormatHandler } from '../../../lib/formatHandlers/segment/undeletableLinkFormatHandler';

describe('undeletableLinkFormatHandler.parse', () => {
    it('parse from other node', () => {
        const div = document.createElement('div');
        const format: UndeletableFormat = {};

        undeletableLinkFormatHandler.parse(format, div, {} as any, {});

        expect(format).toEqual({});
    });

    it('parse from a', () => {
        const a = document.createElement('a');
        const format: UndeletableFormat = {};

        undeletableLinkFormatHandler.parse(format, a, {} as any, {});

        expect(format).toEqual({});
    });

    it('parse from a with the hidden property', () => {
        const a = document.createElement('a');
        const format: UndeletableFormat = {};

        (a as any).__roosterjsHiddenProperty = {
            undeletable: true,
        };

        undeletableLinkFormatHandler.parse(format, a, {} as any, {});

        expect(format).toEqual({
            undeletable: true,
        });
    });
});

describe('undeletableLinkFormatHandler.apply', () => {
    it('apply to other node', () => {
        const div = document.createElement('div');
        const format: UndeletableFormat = {
            undeletable: true,
        };

        undeletableLinkFormatHandler.apply(format, div, {} as any);

        expect((div as any).__roosterjsHiddenProperty).toBeUndefined();
    });

    it('apply to a without the hidden property', () => {
        const a = document.createElement('a');
        const format: UndeletableFormat = {
            undeletable: true,
        };

        undeletableLinkFormatHandler.apply(format, a, {} as any);

        expect((a as any).__roosterjsHiddenProperty).toEqual({
            undeletable: true,
        });
    });

    it('apply to a with the hidden property', () => {
        const a = document.createElement('a');
        const format: UndeletableFormat = {};

        (a as any).__roosterjsHiddenProperty = {
            test: 'value',
        };

        undeletableLinkFormatHandler.apply(format, a, {} as any);

        expect((a as any).__roosterjsHiddenProperty).toEqual({
            test: 'value',
        });
    });
});
