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

        expect(format.fontWeight).toBeUndefined();
    });

    it('bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(value => {
            div.style.fontWeight = value;
            boldFormatHandler.parse(format, div, context, {});

            expect(format.fontWeight).toBe(value);
        });
    });

    it('Not bold with value', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(value => {
            div.style.fontWeight = value;
            boldFormatHandler.parse(format, div, context, {});

            expect(format.fontWeight).toBe(value);
        });
    });

    it('bold 600', () => {
        div.style.fontWeight = '600';
        boldFormatHandler.parse(format, div, context, {});

        expect(format.fontWeight).toBe('600');
    });

    it('default style to bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(value => {
            boldFormatHandler.parse(format, div, context, { fontWeight: value });

            expect(format.fontWeight).toBe(value);
        });
    });

    it('default style to not bold', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(value => {
            boldFormatHandler.parse(format, div, context, { fontWeight: value });

            expect(format.fontWeight).toBe(value);
        });
    });

    it('style overwrite default style to bold', () => {
        ['bold', 'bolder', '600', '700'].forEach(styleValue => {
            ['normal', 'lighter', 'initial', '500'].forEach(defaultStyleValue => {
                div.style.fontWeight = styleValue;
                boldFormatHandler.parse(format, div, context, { fontWeight: defaultStyleValue });

                expect(format.fontWeight).toBe(styleValue);
            });
        });
    });

    it('style overwrite default style to not bold', () => {
        ['normal', 'lighter', 'initial', '500'].forEach(styleValue => {
            ['bold', 'bolder', '600', '700'].forEach(defaultStyleValue => {
                div.style.fontWeight = styleValue;
                boldFormatHandler.parse(format, div, context, { fontWeight: defaultStyleValue });

                expect(format.fontWeight).toBe(styleValue);
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
        format.fontWeight = 'normal';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Set bold to true', () => {
        format.fontWeight = 'bold';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><b></b></div>');
    });

    it('Set bold to true with content', () => {
        format.fontWeight = 'bold';
        div.innerHTML = 'test';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><b>test</b></div>');
    });

    it('Turn off bold when there is bold from block', () => {
        div.innerHTML = 'test';
        context.implicitFormat.fontWeight = 'bold';
        format.fontWeight = 'normal';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-weight: normal;">test</div>');
    });

    it('Change bold when there is bold from block', () => {
        div.innerHTML = 'test';
        context.implicitFormat.fontWeight = 'bold';
        format.fontWeight = '600';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-weight: 600;">test</div>');
    });

    it('No change when bold from block and same with current format', () => {
        div.innerHTML = 'test';
        context.implicitFormat.fontWeight = 'bold';
        format.fontWeight = 'bold';

        boldFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div>test</div>');
    });
});
