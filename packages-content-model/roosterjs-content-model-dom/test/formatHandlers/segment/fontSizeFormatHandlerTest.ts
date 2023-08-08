import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { fontSizeFormatHandler } from '../../../lib/formatHandlers/segment/fontSizeFormatHandler';
import {
    DomToModelContext,
    FontSizeFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('fontSizeFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: FontSizeFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No font size', () => {
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBeUndefined();
    });

    it('Font size from element', () => {
        div.style.fontSize = '100px';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('100px');
    });

    it('Font size from default style', () => {
        fontSizeFormatHandler.parse(format, div, context, { fontSize: '100px' });

        expect(format.fontSize).toBe('100px');
    });

    it('Font size from element overwrite default style', () => {
        div.style.fontSize = '100px';
        fontSizeFormatHandler.parse(format, div, context, { fontSize: '50px' });

        expect(format.fontSize).toBe('100px');
    });

    it('Font size with sub/sup', () => {
        div.style.fontSize = 'smaller';
        div.style.verticalAlign = 'sub';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBeUndefined();
    });

    it('inherit', () => {
        format.fontSize = '20px';
        div.style.fontFamily = 'inherit';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('20px');
    });

    it('xx-small', () => {
        div.style.fontSize = 'xx-small';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('6.75pt');
    });
    it('x-small', () => {
        div.style.fontSize = 'x-small';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('7.5pt');
    });
    it('small', () => {
        div.style.fontSize = 'small';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('9.75pt');
    });
    it('medium', () => {
        div.style.fontSize = 'medium';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('12pt');
    });
    it('large', () => {
        div.style.fontSize = 'large';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('13.5pt');
    });
    it('x-large', () => {
        div.style.fontSize = 'x-large';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('18pt');
    });
    it('xx-large', () => {
        div.style.fontSize = 'xx-large';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('24pt');
    });
    it('xxx-large', () => {
        div.style.fontSize = 'xxx-large';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('36pt');
    });

    it('smaller without context', () => {
        div.style.fontSize = 'smaller';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe(undefined);
    });

    it('smaller with context', () => {
        div.style.fontSize = 'smaller';
        context.segmentFormat.fontSize = '12pt';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('13.33px');
    });

    it('larger without context', () => {
        div.style.fontSize = 'larger';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe(undefined);
    });

    it('larger with context', () => {
        div.style.fontSize = 'larger';
        context.segmentFormat.fontSize = '10pt';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('16px');
    });

    it('em without context', () => {
        div.style.fontSize = '2em';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe(undefined);
    });

    it('em with context', () => {
        div.style.fontSize = '2em';
        context.segmentFormat.fontSize = '12pt';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('32px');
    });

    it('% without context', () => {
        div.style.fontSize = '50%';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe(undefined);
    });
    it('% with context', () => {
        div.style.fontSize = '50%';
        context.segmentFormat.fontSize = '12pt';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('8px');
    });
});

describe('fontSizeFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: FontSizeFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no font size', () => {
        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has font size', () => {
        format.fontSize = '100px';

        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-size: 100px;"></div>');
    });

    it('Has implicit font size from context', () => {
        context.implicitFormat.fontSize = '20px';

        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has implicit font size from context and same with current format', () => {
        context.implicitFormat.fontSize = '20px';
        format.fontSize = '20px';

        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has implicit font size from context but overridden by current format', () => {
        context.implicitFormat.fontSize = '20px';
        format.fontSize = '40px';

        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-size: 40px;"></div>');
    });
});
