import { BackgroundColorFormat } from '../../../lib/publicTypes/format/formatParts/BackgroundColorFormat';
import { backgroundColorFormatHandler } from '../../../lib/formatHandlers/common/backgroundColorFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('backgroundColorFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: BackgroundColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No color', () => {
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBeUndefined();
    });

    it('Simple css color', () => {
        div.style.backgroundColor = 'red';
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Transparent', () => {
        div.style.backgroundColor = 'transparent';
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('transparent');
    });

    it('Simple attribute color', () => {
        div.setAttribute('bgcolor', 'red');
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Simple both css and attribute color', () => {
        div.style.backgroundColor = 'red';
        div.setAttribute('bgcolor', 'green');
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Dark mode color with ogsb', () => {
        context.isDarkMode = true;
        div.style.backgroundColor = 'red';
        div.dataset.ogsb = 'blue';
        div.dataset.ogsc = 'green';

        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('blue');
    });

    it('Dark mode color with ogab', () => {
        context.isDarkMode = true;
        div.style.backgroundColor = 'red';
        div.dataset.ogab = 'blue';
        div.dataset.ogac = 'green';

        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('blue');
    });

    it('Dark mode color with ogsb and ogab', () => {
        context.isDarkMode = true;
        div.style.backgroundColor = 'red';
        div.dataset.ogab = 'blue';
        div.dataset.ogsb = 'green';

        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('green');
    });

    it('Color from element overwrite default style', () => {
        div.style.backgroundColor = 'red';

        backgroundColorFormatHandler.parse(format, div, context, { color: 'green' });

        expect(format.backgroundColor).toBe('red');
    });
});

describe('backgroundColorFormatHandler.apply', () => {
    let div: HTMLElement;
    let context: ModelToDomContext;
    let format: BackgroundColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createModelToDomContext();

        format = {};
    });

    it('No color', () => {
        backgroundColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Simple color', () => {
        format.backgroundColor = 'red';

        backgroundColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="background-color: red;"></div>');
    });

    it('Simple color in dark mode', () => {
        format.backgroundColor = 'red';
        context.isDarkMode = true;
        context.getDarkColor = () => 'green';

        backgroundColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div data-ogsb="red" style="background-color: green;"></div>');
    });
});
