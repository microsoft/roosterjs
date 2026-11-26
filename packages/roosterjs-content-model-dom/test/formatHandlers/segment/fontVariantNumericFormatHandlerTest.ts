import { fontVariantNumericFormatHandler } from '../../../lib/formatHandlers/segment/fontVariantNumericFormatHandler';
import { createDomToModelContext, createModelToDomContext } from '../../../lib/index';
import type { FontVariantNumericFormat } from 'roosterjs-content-model-types';

describe('fontVariantNumericFormatHandler', () => {
    it('changes native spacing without erasing numeral form or fractions', () => {
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply(
            {
                fontVariantNumeric: 'oldstyle-nums tabular-nums diagonal-fractions',
                wordNumberSpacing: 'proportional',
            },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontVariantNumeric).toContain('oldstyle-nums');
        expect(element.style.fontVariantNumeric).toContain('proportional-nums');
        expect(element.style.fontVariantNumeric).toContain('diagonal-fractions');
        expect(element.style.fontVariantNumeric).not.toContain('tabular-nums');
    });
    it('resets spacing while preserving numeral form', () => {
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply(
            {
                fontVariantNumeric: 'lining-nums proportional-nums',
                wordNumberSpacing: 'default',
            },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontVariantNumeric).toBe('lining-nums');
    });
    it('resets native formatting when leaving the run', () => {
        const context = createModelToDomContext();
        context.implicitFormat.wordNumberSpacing = 'proportional';
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply({}, element, context);
        expect(element.style.fontVariantNumeric).toBe('normal');
    });
    it('lets explicit standard numeric CSS replace native spacing', () => {
        const format: FontVariantNumericFormat = { wordNumberSpacing: 'proportional' };
        const element = document.createElement('span');
        element.style.fontVariantNumeric = 'tabular-nums';
        fontVariantNumericFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format).toEqual({ fontVariantNumeric: 'tabular-nums' });
    });
});
