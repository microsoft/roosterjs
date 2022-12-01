import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { FontSizeFormat } from '../../../lib/publicTypes/format/formatParts/FontSizeFormat';
import { fontSizeFormatHandler } from '../../../lib/formatHandlers/segment/fontSizeFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

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
