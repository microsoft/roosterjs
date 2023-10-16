import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { marginBlockFormatHandler } from '../../../lib/formatHandlers/block/marginBlockFormatHandler';
import {
    DomToModelContext,
    MarginBlockFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('marginBlockFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: MarginBlockFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No margin block', () => {
        marginBlockFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has margin block in CSS', () => {
        div.style.marginBlockEnd = '1px';
        div.style.marginBlockStart = '1px';
        marginBlockFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginBlockEnd: '1px',
            marginBlockStart: '1px',
        });
    });

    it('Has margin block in default style', () => {
        marginBlockFormatHandler.parse(format, div, context, {
            marginBlockEnd: '1em',
            marginBlockStart: '1em',
        });
        expect(format).toEqual({
            marginBlockEnd: '0px',
            marginBlockStart: '0px',
        });
    });

    it('Merge margin values', () => {
        div.style.marginBlockStart = '15pt';
        format.marginBlockStart = '30px';
        marginBlockFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginBlockStart: '20px',
        });
    });
});

describe('marginBlockFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: MarginBlockFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No margin block', () => {
        marginBlockFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has margin block', () => {
        format.marginBlockEnd = '1px';
        format.marginBlockStart = '2px';

        marginBlockFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="margin-block: 2px 1px;"></div>');
    });
});
