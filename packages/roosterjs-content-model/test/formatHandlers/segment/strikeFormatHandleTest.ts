import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { StrikeFormat } from '../../../lib/publicTypes/format/formatParts/StrikeFormat';
import { strikeFormatHandler } from '../../../lib/formatHandlers/segment/strikeFormatHandler';

describe('strikeFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: StrikeFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No strikethrough', () => {
        strikeFormatHandler.parse(format, div, context, {});

        expect(format.strikethrough).toBeUndefined();
    });

    it('strikethrough from element', () => {
        ['line-through', 'line-through underline'].forEach(value => {
            div.style.textDecoration = value;
            strikeFormatHandler.parse(format, div, context, {});

            expect(format.strikethrough).toBeTrue();
        });
    });

    it('No strikethrough from element', () => {
        div.style.textDecoration = 'none';
        strikeFormatHandler.parse(format, div, context, {});

        expect(format.strikethrough).toBeUndefined();
    });

    it('strikethrough from default style', () => {
        ['line-through', 'line-through underline'].forEach(value => {
            strikeFormatHandler.parse(format, div, context, { textDecoration: value });

            expect(format.strikethrough).toBeTrue();
        });
    });

    it('No strikethrough from default style', () => {
        strikeFormatHandler.parse(format, div, context, { textDecoration: 'none' });

        expect(format.strikethrough).toBeUndefined();
    });

    it('strikethrough from element overwrite default style', () => {
        ['line-through', 'line-through underline'].forEach(styleValue => {
            div.style.textDecoration = styleValue;
            strikeFormatHandler.parse(format, div, context, { textDecoration: 'none' });

            expect(format.strikethrough).toBeTrue();
        });
    });

    it('No strikethrough from element overwrite default style', () => {
        ['strikethrough', 'line-through underline'].forEach(defaultStyleValue => {
            div.style.textDecoration = 'none';
            strikeFormatHandler.parse(format, div, context, { textDecoration: defaultStyleValue });

            expect(format.strikethrough).toBeUndefined();
        });
    });
});

describe('strikeFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: StrikeFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no strikethrough', () => {
        strikeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('strikethrough is false', () => {
        format.strikethrough = false;

        strikeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has strikethrough', () => {
        format.strikethrough = true;

        strikeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><s></s></div>');
    });

    it('Has strikethrough with text', () => {
        format.strikethrough = true;
        div.innerHTML = 'test';

        strikeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><s>test</s></div>');
    });
});
