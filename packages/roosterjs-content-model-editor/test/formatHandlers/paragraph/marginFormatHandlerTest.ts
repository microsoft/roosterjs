import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { MarginFormat } from '../../../lib/publicTypes/format/formatParts/MarginFormat';
import { marginFormatHandler } from '../../../lib/formatHandlers/paragraph/marginFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

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
});
