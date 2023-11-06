import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext, MarginFormat, ModelToDomContext } from 'roosterjs-content-model-types';
import { marginFormatHandler } from '../../../lib/formatHandlers/block/marginFormatHandler';

describe('marginFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: MarginFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No margin', () => {
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has margin in CSS', () => {
        div.style.margin = '1px 2px 3px 4px';
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginTop: '1px',
            marginRight: '2px',
            marginBottom: '3px',
            marginLeft: '4px',
        });
    });

    it('Has margin in default style', () => {
        marginFormatHandler.parse(format, div, context, {
            marginTop: '1em',
            marginBottom: '1em',
        });
        expect(format).toEqual({
            marginTop: '1em',
            marginBottom: '1em',
        });
    });

    it('Merge margin values', () => {
        div.style.marginLeft = '15pt';
        format.marginLeft = '30px';
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginLeft: '50px',
        });
    });

    it('Has margin block in CSS', () => {
        div.style.marginBlockEnd = '1px';
        div.style.marginBlockStart = '1px';
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginBlockEnd: '1px',
            marginBlockStart: '1px',
        });
    });

    it('Has margin block in default style', () => {
        marginFormatHandler.parse(format, div, context, {
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
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginBlockStart: '20px',
        });
    });

    it('Do not overlay margin values with margin block values', () => {
        div.style.margin = '1px 2px 3px 4px';
        div.style.marginBlockEnd = '5px';
        div.style.marginBlockStart = '6px';
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginTop: '1px',
            marginRight: '2px',
            marginBottom: '3px',
            marginLeft: '4px',
        });
    });
});

describe('marginFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: MarginFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No margin', () => {
        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has margin', () => {
        format.marginTop = '1px';
        format.marginRight = '2px';
        format.marginBottom = '3px';
        format.marginLeft = '4px';

        marginFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="margin: 1px 2px 3px 4px;"></div>');
    });

    it('Has implicit format', () => {
        context.implicitFormat = {
            marginTop: '1em',
            marginBottom: '1em',
        };

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="margin-top: 0px; margin-bottom: 0px;"></div>');
    });

    it('Has implicit format and different value in CSS', () => {
        context.implicitFormat = {
            marginTop: '1em',
            marginBottom: '1em',
        };
        format.marginTop = '2em';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="margin-top: 2em; margin-bottom: 0px;"></div>');
    });

    it('Has implicit format and same value in CSS', () => {
        context.implicitFormat = {
            marginTop: '1em',
            marginBottom: '1em',
        };
        format.marginTop = '1em';
        format.marginBottom = '1em';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('No margin block', () => {
        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has margin block', () => {
        format.marginBlockEnd = '1px';
        format.marginBlockStart = '2px';

        marginFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="margin-block: 2px 1px;"></div>');
    });

    it('Do not overlay margin values with margin block values', () => {
        format.marginTop = '1px';
        format.marginRight = '2px';
        format.marginBottom = '3px';
        format.marginLeft = '4px';
        format.marginBlockEnd = '5px';
        format.marginBlockStart = '6px';

        marginFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="margin: 1px 2px 3px 4px;"></div>');
    });
});
