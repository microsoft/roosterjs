import { BoldFormat } from '../../../lib/publicTypes/format/formatParts/BoldFormat';
import { boldFormatHandler } from '../../../lib/formatHandlers/segment/boldFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('boldFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: BoldFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('Not bold', () => {
        boldFormatHandler.parse(format, div, context, {});

        expect(format.bold).toBeUndefined();
    });

    it('bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(value => {
            div.style.fontWeight = value;
            boldFormatHandler.parse(format, div, context, {});

            expect(format.bold).toBeTrue();
        });
    });

    it('Not bold with value', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(value => {
            div.style.fontWeight = value;
            boldFormatHandler.parse(format, div, context, {});

            expect(format.bold).toBeFalse();
        });
    });

    it('bold 600', () => {
        div.style.fontWeight = '600';
        boldFormatHandler.parse(format, div, context, {});

        expect(format.bold).toBeTrue();
    });

    it('default style to bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(value => {
            boldFormatHandler.parse(format, div, context, { fontWeight: value });

            expect(format.bold).toBeTrue();
        });
    });

    it('default style to not bold', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(value => {
            boldFormatHandler.parse(format, div, context, { fontWeight: value });

            expect(format.bold).toBeFalse();
        });
    });

    it('style overwrite default style to bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(styleValue => {
            ['normal', 'lighter', 'initial', '500'].forEach(defaultStyleValue => {
                div.style.fontWeight = styleValue;
                boldFormatHandler.parse(format, div, context, { fontWeight: defaultStyleValue });

                expect(format.bold).toBeTrue();
            });
        });
    });

    it('style overwrite default style to not bold', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(styleValue => {
            ['bold', 'bolder', '600', '700'].forEach(defaultStyleValue => {
                div.style.fontWeight = styleValue;
                boldFormatHandler.parse(format, div, context, { fontWeight: defaultStyleValue });

                expect(format.bold).toBeFalse();
            });
        });
    });
});

describe('boldFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BoldFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no bold', () => {
        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Set bold to false', () => {
        format.bold = false;

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Set bold to true', () => {
        format.bold = true;

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><b></b></div>');
    });

    it('Set bold to true with content', () => {
        format.bold = true;
        div.innerHTML = 'test';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><b>test</b></div>');
    });
});
