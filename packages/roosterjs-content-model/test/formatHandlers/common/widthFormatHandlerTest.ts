import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { WidthFormat } from '../../../lib/publicTypes/format/formatParts/WidthFormat';
import { widthFormatHandler } from '../../../lib/formatHandlers/common/widthFormatHandler';

describe('widthFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: WidthFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No word break', () => {
        widthFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has word break', () => {
        div.style.width = '100pt';
        widthFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({ width: '100pt' });
    });
});

describe('wordBreakFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: WidthFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No word break', () => {
        widthFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has word-break', () => {
        format.width = '100pt';
        widthFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="width: 100pt;"></div>');
    });
});
