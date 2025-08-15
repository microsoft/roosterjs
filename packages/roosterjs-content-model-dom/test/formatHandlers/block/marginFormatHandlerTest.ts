import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { marginFormatHandler } from '../../../lib/formatHandlers/block/marginFormatHandler';
import {
    DirectionFormat,
    DomToModelContext,
    MarginFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('marginFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: MarginFormat & DirectionFormat;
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

    it('Merge margin values', () => {
        div.style.marginTop = '15pt';
        format.marginTop = '30px';
        marginFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            marginTop: '15pt',
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

    it('Default margin left in ltr', () => {
        marginFormatHandler.parse(format, div, context, {
            marginInlineStart: '20px',
        });

        expect(format).toEqual({
            marginLeft: '20px',
        });
    });

    it('Default margin left in rtl', () => {
        format.direction = 'rtl';

        marginFormatHandler.parse(format, div, context, {
            marginInlineStart: '20px',
        });

        expect(format).toEqual({
            marginRight: '20px',
            direction: 'rtl',
        });
    });

    it('Already has margin left in ltr', () => {
        div.style.marginLeft = '40px';

        marginFormatHandler.parse(format, div, context, {
            marginInlineStart: '20px',
        });

        expect(format).toEqual({
            marginLeft: '40px',
        });
    });

    it('Already has margin left in rtl', () => {
        div.style.marginLeft = '30px';
        div.style.marginRight = '40px';
        format.direction = 'rtl';

        marginFormatHandler.parse(format, div, context, {
            marginInlineStart: '20px',
        });

        expect(format).toEqual({
            marginLeft: '30px',
            marginRight: '40px',
            direction: 'rtl',
        });
    });
});

describe('marginFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: MarginFormat & DirectionFormat;
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

    it('Has implicit format and different value in CSS in ltr', () => {
        context.implicitFormat = {
            marginLeft: '1em',
        };
        format.marginLeft = '2em';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="margin-left: 2em;"></div>');
    });

    it('Has implicit format and same value in CSS in ltr', () => {
        context.implicitFormat = {
            marginLeft: '1em',
        };
        format.marginLeft = '1em';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has implicit format and different value in CSS in rtl', () => {
        context.implicitFormat = {
            marginLeft: '1em',
        };
        format.marginRight = '2em';
        format.direction = 'rtl';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="margin-right: 2em;"></div>');
    });

    it('Has implicit format and same value in CSS in rtl', () => {
        context.implicitFormat = {
            marginLeft: '1em',
        };
        format.marginRight = '1em';
        format.direction = 'rtl';

        marginFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });
});
