import { fontVariantLigaturesFormatHandler } from '../../../lib/formatHandlers/segment/fontVariantLigaturesFormatHandler';
import { createDomToModelContext, createModelToDomContext } from '../../../lib/index';
import type { FontVariantLigaturesFormat } from 'roosterjs-content-model-types';

describe('fontVariantLigaturesFormatHandler', () => {
    it('preserves explicit CSS instead of inherited features', () => {
        const format: FontVariantLigaturesFormat = { fontVariantLigatures: 'common-ligatures' };
        const element = document.createElement('span');
        element.style.fontVariantLigatures = 'none';

        fontVariantLigaturesFormatHandler.parse(format, element, createDomToModelContext(), {});

        expect(format).toEqual({ fontVariantLigatures: 'none' });
    });

    it('resets inherited features when formatting is cleared', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.fontVariantLigatures = 'none';

        fontVariantLigaturesFormatHandler.apply({}, element, context);

        expect(element.style.fontVariantLigatures).toBe('normal');
    });
});
