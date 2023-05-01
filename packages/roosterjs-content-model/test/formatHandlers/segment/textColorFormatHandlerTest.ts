import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TextColorFormat } from '../../../lib/publicTypes/format/formatParts/TextColorFormat';
import { textColorFormatHandler } from '../../../lib/formatHandlers/segment/textColorFormatHandler';

describe('textColorFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: TextColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        context.darkColorHandler = new DarkColorHandlerImpl(div, s => 'darkMock: ' + s);
        format = {};
    });

    it('No color', () => {
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBeUndefined();
    });

    it('Simple css color', () => {
        div.style.color = 'red';
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBe('red');
    });

    it('Transparent', () => {
        div.style.color = 'transparent';
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBe('transparent');
    });

    it('Simple attribute color', () => {
        div.setAttribute('color', 'red');
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBe('red');
    });

    it('Simple both css and attribute color', () => {
        div.style.color = 'red';
        div.setAttribute('bgcolor', 'green');
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBe('red');
    });

    it('Color from element overwrite default style', () => {
        div.style.color = 'red';

        textColorFormatHandler.parse(format, div, context, { color: 'green' });

        expect(format.textColor).toBe('red');
    });

    it('Color from hyperlink', () => {
        textColorFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Color from hyperlink with override', () => {
        div.style.color = 'red';

        textColorFormatHandler.parse(format, div, context, context.defaultStyles.a!);

        expect(format).toEqual({
            textColor: 'red',
        });
    });

    it('inherit', () => {
        format.textColor = 'red';
        div.style.fontFamily = 'inherit';
        textColorFormatHandler.parse(format, div, context, {});

        expect(format.textColor).toBe('red');
    });
});

describe('textColorFormatHandler.apply', () => {
    let div: HTMLElement;
    let context: ModelToDomContext;
    let format: TextColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createModelToDomContext();
        context.darkColorHandler = new DarkColorHandlerImpl(div, s => 'darkMock: ' + s);

        format = {};
    });

    it('No color', () => {
        textColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Simple color', () => {
        format.textColor = 'red';

        textColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('Simple color in dark mode', () => {
        format.textColor = 'red';
        context.isDarkMode = true;

        textColorFormatHandler.apply(format, div, context);

        const result = [
            '<div style="--darkColor_red:darkMock: red; color: var(--darkColor_red, red);"></div>',
            '<div style="--darkColor_red: darkMock: red; color: var(--darkColor_red, red);"></div>',
        ].indexOf(div.outerHTML);

        expect(result).toBeGreaterThanOrEqual(0, div.outerHTML);
    });

    it('HyperLink without color', () => {
        const a = document.createElement('a');

        textColorFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toBe('<a></a>');
    });

    it('HyperLink with default color', () => {
        const a = document.createElement('a');

        textColorFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toBe('<a></a>');
    });

    it('HyperLink with color override', () => {
        const a = document.createElement('a');

        format.textColor = 'red';

        textColorFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toBe('<a style="color: red;"></a>');
    });
});
