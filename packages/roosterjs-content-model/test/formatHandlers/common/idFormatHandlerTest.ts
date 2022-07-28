import { createFormatContext } from '../../../lib/formatHandlers/createFormatContext';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';
import { IdFormat } from '../../../lib/publicTypes/format/formatParts/IdFormat';
import { idFormatHandler } from '../../../lib/formatHandlers/common/idFormatHandler';

describe('idFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: IdFormat;
    let context: FormatContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createFormatContext();
    });

    it('No id', () => {
        idFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });

    it('Has id', () => {
        div.id = 'test';
        idFormatHandler.parse(format, div, context);
        expect(format).toEqual({ id: 'test' });
    });
});

describe('idFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: IdFormat;
    let context: FormatContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createFormatContext();
    });

    it('No id', () => {
        idFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has id', () => {
        format.id = 'test';
        idFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div id="test"></div>');
    });
});
