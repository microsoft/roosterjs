import { ContentModelTableFormat, DomToModelContext } from 'roosterjs-content-model-types';
import { wordTableParser } from '../../../lib/paste/parsers/wordTableParser';

describe('wordTableParser', () => {
    let format: ContentModelTableFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    let defaultStyle: Readonly<Partial<CSSStyleDeclaration>>;

    beforeEach(() => {
        format = {};
        element = document.createElement('table');
        context = {} as any;
        defaultStyle = {};
    });

    it('should remove marginLeft when it starts with negative value', () => {
        format.marginLeft = '-5px';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
    });

    it('should remove marginLeft when it starts with negative number', () => {
        format.marginLeft = '-10.5px';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
    });

    it('should not remove marginLeft when it is positive', () => {
        format.marginLeft = '5px';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBe('5px');
    });

    it('should not remove marginLeft when it is zero', () => {
        format.marginLeft = '0px';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBe('0px');
    });

    it('should remove htmlAlign property', () => {
        format.htmlAlign = 'center';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should handle both negative marginLeft and htmlAlign together', () => {
        format.marginLeft = '-8px';
        format.htmlAlign = 'start';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should preserve other format properties', () => {
        format.marginTop = '10px';
        format.marginRight = '5px';
        format.marginLeft = '-3px';
        format.htmlAlign = 'end';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginTop).toBe('10px');
        expect(format.marginRight).toBe('5px');
        expect(format.marginLeft).toBeUndefined();
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should handle undefined marginLeft', () => {
        format.htmlAlign = 'center';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should handle empty marginLeft string', () => {
        format.marginLeft = '';
        format.htmlAlign = 'center';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBe('');
        expect(format.htmlAlign).toBeUndefined();
    });

    it('should not affect format when no negative marginLeft or htmlAlign', () => {
        format.marginLeft = '5px';
        format.marginTop = '10px';
        wordTableParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBe('5px');
        expect(format.marginTop).toBe('10px');
    });
});
