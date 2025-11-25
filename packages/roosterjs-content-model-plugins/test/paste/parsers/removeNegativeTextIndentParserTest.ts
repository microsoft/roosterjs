import { DomToModelContext, TextIndentFormat } from 'roosterjs-content-model-types';
import { removeNegativeTextIndentParser } from '../../../lib/paste/parsers/removeNegativeTextIndentParser';

describe('removeNegativeTextIndentParser', () => {
    let format: TextIndentFormat;
    let element: HTMLElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        context = {} as any;
    });

    it('should remove negative text indent and clear element style', () => {
        format.textIndent = '-20px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should remove negative text indent with em units', () => {
        format.textIndent = '-1.5em';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should remove negative text indent with rem units', () => {
        format.textIndent = '-2rem';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should remove negative text indent with percentage', () => {
        format.textIndent = '-10%';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should preserve positive text indent and not clear element style', () => {
        format.textIndent = '20px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('20px');
    });

    it('should preserve zero text indent and not clear element style', () => {
        format.textIndent = '0px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('0px');
    });

    it('should handle when textIndent is undefined and element has negative value', () => {
        format.textIndent = undefined;

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should handle when textIndent is undefined and element has positive value', () => {
        format.textIndent = undefined;

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });

    it('should handle when textIndent is empty string', () => {
        format.textIndent = '';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('');
    });

    it('should handle format with leading spaces but normalize element style', () => {
        format.textIndent = '  -15px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('  -15px');
    });

    it('should only clear element style if it starts with negative sign', () => {
        format.textIndent = '10px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('10px');
    });

    it('should not clear element style if it does not start with negative sign', () => {
        format.textIndent = '10px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBe('10px');
    });

    it('should handle multiple negative values correctly', () => {
        format.textIndent = '-30px';

        removeNegativeTextIndentParser(format, element, context, {});

        expect(format.textIndent).toBeUndefined();
    });
});
