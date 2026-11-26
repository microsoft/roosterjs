import { fontVariantNumericFormatHandler } from '../../../lib/formatHandlers/segment/fontVariantNumericFormatHandler';
import { createDomToModelContext, createModelToDomContext } from '../../../lib/index';
import type { FontVariantNumericFormat } from 'roosterjs-content-model-types';

describe('fontVariantNumericFormatHandler', () => {
    it('changes native form while preserving spacing and fractions', () => {
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply(
            {
                wordNumberForm: 'oldstyle',
                fontVariantNumeric: 'lining-nums tabular-nums diagonal-fractions',
            },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontVariantNumeric).toContain('oldstyle-nums');
        expect(element.style.fontVariantNumeric).toContain('tabular-nums');
        expect(element.style.fontVariantNumeric).toContain('diagonal-fractions');
        expect(element.style.fontVariantNumeric).not.toContain('lining-nums');
    });
    it('resets native form without clearing unrelated spacing', () => {
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply(
            { wordNumberForm: 'default', fontVariantNumeric: 'oldstyle-nums proportional-nums' },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontVariantNumeric).toBe('proportional-nums');
    });
    it('clears inherited native form for explicit numeric CSS', () => {
        const format: FontVariantNumericFormat = { wordNumberForm: 'oldstyle' };
        const element = document.createElement('span');
        element.style.fontVariantNumeric = 'normal';
        fontVariantNumericFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.wordNumberForm).toBeUndefined();
    });
    it('does not destroy unresolved standard CSS', () => {
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply(
            { wordNumberForm: 'oldstyle', fontVariantNumeric: 'var(--numeric)' },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontVariantNumeric).toBe('var(--numeric)');
    });
    it('resets formatting when leaving a native run', () => {
        const context = createModelToDomContext();
        context.implicitFormat.wordNumberForm = 'oldstyle';
        const element = document.createElement('span');
        fontVariantNumericFormatHandler.apply({}, element, context);
        expect(element.style.fontVariantNumeric).toBe('normal');
    });
});
