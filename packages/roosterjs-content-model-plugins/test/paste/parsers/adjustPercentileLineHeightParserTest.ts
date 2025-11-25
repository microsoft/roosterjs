import { adjustPercentileLineHeight } from '../../../lib/paste/parsers/adjustPercentileLineHeightParser';
import { ContentModelBlockFormat } from 'roosterjs-content-model-types';

describe('adjustPercentileLineHeight', () => {
    let format: ContentModelBlockFormat;
    let element: HTMLElement;

    beforeEach(() => {
        format = {};
        element = document.createElement('p');
    });

    it('should convert percentage line height using browser default multiplier', () => {
        element.style.lineHeight = '100%';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBe('1.2');
    });

    it('should convert percentage line height with different values', () => {
        element.style.lineHeight = '150%';
        adjustPercentileLineHeight(format, element);
        expect(parseFloat(format.lineHeight!)).toBeCloseTo(1.8, 5);
    });

    it('should convert percentage line height with low values', () => {
        element.style.lineHeight = '50%';
        adjustPercentileLineHeight(format, element);
        expect(parseFloat(format.lineHeight!)).toBeCloseTo(0.6, 5);
    });

    it('should convert normal line height to 120%', () => {
        element.style.lineHeight = 'normal';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBe('120%');
    });

    it('should convert NORMAL (uppercase) line height to 120% - case insensitive', () => {
        element.style.lineHeight = 'NORMAL';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBe('120%');
    });

    it('should not modify line height when it is not percentage or normal', () => {
        element.style.lineHeight = '1.5';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBeUndefined();
    });

    it('should not modify line height when percentage is invalid', () => {
        element.style.lineHeight = 'abc%';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBeUndefined();
    });

    it('should not modify line height when no line height is set', () => {
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBeUndefined();
    });

    it('should handle mixed case normal values', () => {
        element.style.lineHeight = 'Normal';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBe('120%');
    });

    it('should not affect existing format properties', () => {
        format.marginTop = '10px';
        format.marginBottom = '5px';
        element.style.lineHeight = 'normal';
        adjustPercentileLineHeight(format, element);
        expect(format.lineHeight).toBe('120%');
        expect(format.marginTop).toBe('10px');
        expect(format.marginBottom).toBe('5px');
    });
});
