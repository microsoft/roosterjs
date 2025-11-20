import { adjustPercentileLineHeightParser } from '../../../../lib/paste/WordDesktop/parsers/adjustPercentileLineHeightParser';
import type { ContentModelBlockFormat, DomToModelContext } from 'roosterjs-content-model-types';

describe('adjustPercentileLineHeightParser', () => {
    let format: ContentModelBlockFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    let defaultStyle: Readonly<Partial<CSSStyleDeclaration>>;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        context = {} as DomToModelContext;
        defaultStyle = {};
    });

    it('should adjust line height when percentage is less than default', () => {
        element.style.lineHeight = '50%';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBe('0.6'); // 1.2 * (50/100) = 0.6
    });

    it('should adjust line height when percentage is provided', () => {
        element.style.lineHeight = '80%';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBe('0.96'); // 1.2 * (80/100) = 0.96
    });

    it('should set line height to 120% when style is normal', () => {
        element.style.lineHeight = 'normal';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBe('120%');
    });

    it('should not modify format when line height is not percentage or normal', () => {
        element.style.lineHeight = '20px';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBeUndefined();
    });

    it('should not modify format when line height is empty', () => {
        element.style.lineHeight = '';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBeUndefined();
    });

    it('should not modify format when line height percentage is invalid', () => {
        element.style.lineHeight = 'abc%';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBeUndefined();
    });

    it('should handle 100% line height correctly', () => {
        element.style.lineHeight = '100%';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(format.lineHeight).toBe('1.2'); // 1.2 * (100/100) = 1.2
    });

    it('should handle 150% line height correctly', () => {
        element.style.lineHeight = '150%';

        adjustPercentileLineHeightParser(format, element, context, defaultStyle);

        expect(parseFloat(format.lineHeight!)).toBeCloseTo(1.8); // 1.2 * (150/100) = 1.8
    });
});
