import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { UnderlineFormat } from '../../../lib/publicTypes/format/formatParts/UnderlineFormat';
import { underlineFormatHandler } from '../../../lib/formatHandlers/segment/underlineFormatHandler';

describe('underlineFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: UnderlineFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No underline', () => {
        underlineFormatHandler.parse(format, div, context, {});

        expect(format.underline).toBeUndefined();
    });

    it('underline from element', () => {
        ['underline', 'underline line-through'].forEach(value => {
            div.style.textDecoration = value;
            underlineFormatHandler.parse(format, div, context, {});

            expect(format.underline).toBeTrue();
        });
    });

    it('No underline from element', () => {
        div.style.textDecoration = 'none';
        underlineFormatHandler.parse(format, div, context, {});

        expect(format.underline).toBeUndefined();
    });

    it('underline from default style', () => {
        ['underline', 'underline line-through'].forEach(value => {
            underlineFormatHandler.parse(format, div, context, { textDecoration: value });

            expect(format.underline).toBeTrue();
        });
    });

    it('No underline from default style', () => {
        underlineFormatHandler.parse(format, div, context, { textDecoration: 'none' });

        expect(format.underline).toBeUndefined();
    });

    it('underline from element overwrite default style', () => {
        ['underline', 'underline line-through'].forEach(styleValue => {
            div.style.textDecoration = styleValue;
            underlineFormatHandler.parse(format, div, context, {
                textDecoration: 'none',
            });

            expect(format.underline).toBeTrue();
        });
    });

    it('No underline from element overwrite default style', () => {
        ['underline', 'underline line-through'].forEach(defaultStyleValue => {
            div.style.textDecoration = 'none';
            underlineFormatHandler.parse(format, div, context, {
                textDecoration: defaultStyleValue,
            });

            expect(format.underline).toBeUndefined();
        });
    });

    it('Hyperlink without underline', () => {
        div.style.textDecoration = 'none';
        underlineFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });
});

describe('underlineFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: UnderlineFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no underline', () => {
        underlineFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('underline is false', () => {
        format.underline = false;

        underlineFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has underline', () => {
        format.underline = true;

        underlineFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><u></u></div>');
    });

    it('Has underline with text', () => {
        format.underline = true;
        div.innerHTML = 'test';

        underlineFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><u>test</u></div>');
    });

    it('Hyperlink without context', () => {
        const a = document.createElement('a');

        a.textContent = 'test';
        format.underline = true;

        underlineFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toEqual('<a><u>test</u></a>');
    });

    it('Hyperlink with context', () => {
        const a = document.createElement('a');

        a.textContent = 'test';
        format.underline = true;

        context.implicitFormat.underline = true;

        underlineFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toEqual('<a>test</a>');
    });

    it('Hyperlink without underline', () => {
        const a = document.createElement('a');

        a.textContent = 'test';

        context.implicitFormat.underline = true;

        underlineFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toEqual('<a>test</a>');
    });
});
