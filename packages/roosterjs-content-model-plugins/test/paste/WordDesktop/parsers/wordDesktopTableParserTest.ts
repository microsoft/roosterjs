import { wordDesktopTableParser } from '../../../../lib/paste/WordDesktop/parsers/wordDesktopTableParser';
import type { ContentModelTableFormat, DomToModelContext } from 'roosterjs-content-model-types';

describe('wordDesktopTableParser', () => {
    let format: ContentModelTableFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    let defaultStyle: Readonly<Partial<CSSStyleDeclaration>>;

    beforeEach(() => {
        format = {};
        element = document.createElement('table');
        context = {} as DomToModelContext;
        defaultStyle = {};
    });

    it('should remove negative marginLeft', () => {
        format.marginLeft = '-20px';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
    });

    it('should keep positive marginLeft', () => {
        format.marginLeft = '20px';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('20px');
    });

    it('should keep zero marginLeft', () => {
        format.marginLeft = '0px';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('0px');
    });

    it('should remove htmlAlign property', () => {
        format.htmlAlign = 'center';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.htmlAlign).toBeUndefined();
    });

    it('should handle both negative marginLeft and htmlAlign', () => {
        format.marginLeft = '-15px';
        format.htmlAlign = 'start';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should not affect other properties', () => {
        format.marginLeft = '10px';
        format.marginRight = '5px';
        format.width = '100%';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('10px');
        expect(format.marginRight).toBe('5px');
        expect(format.width).toBe('100%');
    });

    it('should handle undefined marginLeft', () => {
        format.marginLeft = undefined;

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
    });

    it('should handle marginLeft that does not start with negative', () => {
        format.marginLeft = 'auto';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('auto');
    });

    it('should remove marginLeft that starts with negative followed by number', () => {
        format.marginLeft = '-5.5px';

        wordDesktopTableParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
    });
});
