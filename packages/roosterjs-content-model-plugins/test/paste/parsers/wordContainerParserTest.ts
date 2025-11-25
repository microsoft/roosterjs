import {
    DomToModelContext,
    ContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';
import { wordContainerParser } from '../../../lib/paste/parsers/wordContainerParser';

describe('wordContainerParser', () => {
    let format: ContentModelFormatContainerFormat;
    let element: HTMLElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        context = {} as any;
    });

    it('should remove negative margin-left with px units', () => {
        format.marginLeft = '-20px';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should remove negative margin-left with em units', () => {
        format.marginLeft = '-1.5em';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should remove negative margin-left with rem units', () => {
        format.marginLeft = '-2rem';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should remove negative margin-left with percentage', () => {
        format.marginLeft = '-10%';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should remove negative margin-left with decimal values', () => {
        format.marginLeft = '-0.25in';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should preserve positive margin-left', () => {
        format.marginLeft = '20px';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBe('20px');
    });

    it('should preserve zero margin-left', () => {
        format.marginLeft = '0px';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBe('0px');
    });

    it('should handle when margin-left is undefined', () => {
        format.marginLeft = undefined;

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
    });

    it('should handle when margin-left is empty string', () => {
        format.marginLeft = '';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBe('');
    });

    it('should handle format with leading spaces in margin-left', () => {
        format.marginLeft = '  -15px';

        wordContainerParser(format, element, context, {});

        // Should NOT be removed because it doesn't start with '-' (has spaces)
        expect(format.marginLeft).toBe('  -15px');
    });

    it('should only affect margin-left and not touch other properties', () => {
        format.marginLeft = '-20px';
        format.marginTop = '-10px';
        format.paddingLeft = '-5px';
        format.backgroundColor = 'red';

        wordContainerParser(format, element, context, {});

        expect(format.marginLeft).toBeUndefined();
        expect(format.marginTop).toBe('-10px');
        expect(format.paddingLeft).toBe('-5px');
        expect(format.backgroundColor).toBe('red');
    });
});
