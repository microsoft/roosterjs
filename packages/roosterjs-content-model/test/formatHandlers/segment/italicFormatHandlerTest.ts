import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ItalicFormat } from '../../../lib/publicTypes/format/formatParts/ItalicFormat';
import { italicFormatHandler } from '../../../lib/formatHandlers/segment/italicFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('italicFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: ItalicFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No italic', () => {
        italicFormatHandler.parse(format, div, context, {});

        expect(format.italic).toBeUndefined();
    });

    it('Italic from element', () => {
        ['italic', 'oblique'].forEach(value => {
            div.style.fontStyle = value;
            italicFormatHandler.parse(format, div, context, {});

            expect(format.italic).toBeTrue();
        });
    });

    it('No italic from element', () => {
        ['initial', 'normal'].forEach(value => {
            div.style.fontStyle = value;
            italicFormatHandler.parse(format, div, context, {});

            expect(format.italic).toBeFalse();
        });
    });

    it('Italic from default style', () => {
        ['italic', 'oblique'].forEach(value => {
            italicFormatHandler.parse(format, div, context, { fontStyle: value });

            expect(format.italic).toBeTrue();
        });
    });

    it('No italic from default style', () => {
        ['initial', 'normal'].forEach(value => {
            italicFormatHandler.parse(format, div, context, { fontStyle: value });

            expect(format.italic).toBeFalse();
        });
    });

    it('Italic from element overwrite default style', () => {
        ['italic', 'oblique'].forEach(styleValue => {
            ['initial', 'normal'].forEach(defaultStyleValue => {
                div.style.fontStyle = styleValue;
                italicFormatHandler.parse(format, div, context, { fontStyle: defaultStyleValue });

                expect(format.italic).toBeTrue();
            });
        });
    });

    it('No italic from element overwrite default style', () => {
        ['initial', 'normal'].forEach(styleValue => {
            ['italic', 'oblique'].forEach(defaultStyleValue => {
                div.style.fontStyle = styleValue;
                italicFormatHandler.parse(format, div, context, { fontStyle: defaultStyleValue });

                expect(format.italic).toBeFalse();
            });
        });
    });
});

describe('italicFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: ItalicFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no italic', () => {
        italicFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Italic is false', () => {
        format.italic = false;

        italicFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has italic', () => {
        format.italic = true;

        italicFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><i></i></div>');
    });

    it('Has italic with text', () => {
        format.italic = true;
        div.innerHTML = 'test';

        italicFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><i>test</i></div>');
    });
});
