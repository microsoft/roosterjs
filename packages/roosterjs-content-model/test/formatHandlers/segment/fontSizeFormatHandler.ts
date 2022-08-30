import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { FontSizeFormat } from '../../../lib/publicTypes/format/formatParts/FontSizeFormat';
import { fontSizeFormatHandler } from '../../../lib/formatHandlers/segment/fontSizeFormatHandler';

describe('fontSizeFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: ContentModelContext;
    let format: FontSizeFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
        format = {};
    });

    it('No font size', () => {
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBeUndefined();
    });

    it('Font size from element', () => {
        div.style.fontSize = '100px';
        fontSizeFormatHandler.parse(format, div, context, {});

        expect(format.fontSize).toBe('100px');
    });

    it('Font size from default style', () => {
        fontSizeFormatHandler.parse(format, div, context, { fontSize: '100px' });

        expect(format.fontSize).toBe('100px');
    });

    it('Font size from element overwrite default style', () => {
        div.style.fontSize = '100px';
        fontSizeFormatHandler.parse(format, div, context, { fontSize: '50px' });

        expect(format.fontSize).toBe('100px');
    });
});

describe('fontSizeFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: FontSizeFormat;
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

    it('no font size', () => {
        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has font size', () => {
        format.fontSize = '100px';

        fontSizeFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="font-size: 100px;"></div>');
    });
});
