import { fontFeatureSettingsFormatHandler } from '../../../lib/formatHandlers/segment/fontFeatureSettingsFormatHandler';
import { createDomToModelContext, createModelToDomContext } from '../../../lib/index';
import type { FontFeatureSettingsFormat } from 'roosterjs-content-model-types';

describe('fontFeatureSettingsFormatHandler', () => {
    const wordLigatureFeatures = '"liga" 0, "clig" 0, "hlig" 0, "dlig" 0';

    it('combines Word ligature flags with an independent explicit feature', () => {
        const element = document.createElement('span');

        fontFeatureSettingsFormatHandler.apply(
            { wordLigatureFeatures, fontFeatureSettings: '"calt" 1' },
            element,
            createModelToDomContext()
        );

        expect(element.style.fontFeatureSettings).toContain('"clig" 0');
        expect(element.style.fontFeatureSettings).toContain('"calt"');
        expect(element.style.fontVariantLigatures).toBe('');
    });

    it('keeps native ligature variants when normal removes extra feature overrides', () => {
        const format: FontFeatureSettingsFormat = { wordLigatureFeatures };
        const element = document.createElement('span');
        element.style.fontFeatureSettings = 'normal';

        fontFeatureSettingsFormatHandler.parse(format, element, createDomToModelContext(), {});

        expect(format).toEqual({ wordLigatureFeatures, fontFeatureSettings: 'normal' });
    });

    it('resets native overrides when their formatting is cleared', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.wordLigatureFeatures = wordLigatureFeatures;

        fontFeatureSettingsFormatHandler.apply({}, element, context);

        expect(element.style.fontFeatureSettings).toBe('normal');
    });
});
