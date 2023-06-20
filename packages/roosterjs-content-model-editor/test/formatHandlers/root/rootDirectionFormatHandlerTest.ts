import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { rootDirectionFormatHandler } from '../../../lib/formatHandlers/root/rootDirectionFormatHandler';

describe('rootDirectionFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: DirectionFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No direction', () => {
        rootDirectionFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('LTR from CSS', () => {
        div.style.direction = 'ltr';

        rootDirectionFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('LTR from attribute', () => {
        div.dir = 'ltr';

        rootDirectionFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('RTL from CSS', () => {
        div.style.direction = 'rtl';

        rootDirectionFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('RTL from attribute', () => {
        div.dir = 'rtl';

        rootDirectionFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });
});

describe('rootDirectionFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: DirectionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('ltr', () => {
        format.direction = 'ltr';

        rootDirectionFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('rtl', () => {
        format.direction = 'rtl';

        rootDirectionFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });
});
