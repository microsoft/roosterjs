import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { FontFamilyFormat } from '../../../lib/publicTypes/format/formatParts/FontFamilyFormat';
import { fontFamilyFormatHandler } from '../../../lib/formatHandlers/segment/fontFamilyFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('fontFamilyFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: FontFamilyFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No font', () => {
        fontFamilyFormatHandler.parse(format, div, context, {});

        expect(format.fontFamily).toBeUndefined();
    });

    it('Font from element', () => {
        div.style.fontFamily = 'test';
        fontFamilyFormatHandler.parse(format, div, context, {});

        expect(format.fontFamily).toBe('test');
    });

    it('Font from default style', () => {
        fontFamilyFormatHandler.parse(format, div, context, { fontFamily: 'test' });

        expect(format.fontFamily).toBe('test');
    });

    it('Font from element overwrite default style', () => {
        div.style.fontFamily = 'test1';
        fontFamilyFormatHandler.parse(format, div, context, { fontFamily: 'test2' });

        expect(format.fontFamily).toBe('test1');
    });

    it('inherit', () => {
        format.fontFamily = 'Arial';
        div.style.fontFamily = 'inherit';
        fontFamilyFormatHandler.parse(format, div, context, {});

        expect(format.fontFamily).toBe('Arial');
    });
});

describe('fontFamilyFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: FontFamilyFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no font', () => {
        fontFamilyFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has font', () => {
        format.fontFamily = 'test';

        fontFamilyFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-family: test;"></div>');
    });

    it('Has implicit font family from context', () => {
        context.implicitFormat.fontFamily = 'test';

        fontFamilyFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has implicit font family from context and same with current format', () => {
        context.implicitFormat.fontFamily = 'test';
        format.fontFamily = 'test';

        fontFamilyFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has implicit font family from context but overridden by current format', () => {
        context.implicitFormat.fontFamily = 'test';
        format.fontFamily = 'test2';

        fontFamilyFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-family: test2;"></div>');
    });
});
