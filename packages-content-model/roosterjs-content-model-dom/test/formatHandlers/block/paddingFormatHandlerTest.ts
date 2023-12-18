import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext, ModelToDomContext, PaddingFormat } from 'roosterjs-content-model-types';
import { paddingFormatHandler } from '../../../lib/formatHandlers/block/paddingFormatHandler';

describe('paddingFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: PaddingFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No padding', () => {
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has padding in CSS', () => {
        div.style.padding = '1px 2px 3px 4px';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingTop: '1px',
            paddingRight: '2px',
            paddingBottom: '3px',
            paddingLeft: '4px',
        });
    });

    it('Overwrite padding values', () => {
        div.style.paddingLeft = '15pt';
        format.paddingLeft = '30px';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingLeft: '15pt',
        });
    });

    it('0 padding', () => {
        div.style.padding = '0 10px 20px 0';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingRight: '10px',
            paddingBottom: '20px',
        });
    });
});

describe('paddingFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: PaddingFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No padding', () => {
        paddingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has padding', () => {
        format.paddingTop = '1px';
        format.paddingRight = '2px';
        format.paddingBottom = '3px';
        format.paddingLeft = '4px';

        paddingFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="padding: 1px 2px 3px 4px;"></div>');
    });
});
