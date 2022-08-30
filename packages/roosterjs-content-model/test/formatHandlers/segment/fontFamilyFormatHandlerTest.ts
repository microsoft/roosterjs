import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { FontFamilyFormat } from '../../../lib/publicTypes/format/formatParts/FontFamilyFormat';
import { fontFamilyFormatHandler } from '../../../lib/formatHandlers/segment/fontFamilyFormatHandler';

describe('fontFamilyFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: ContentModelContext;
    let format: FontFamilyFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
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
});

describe('fontFamilyFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: FontFamilyFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
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
});
