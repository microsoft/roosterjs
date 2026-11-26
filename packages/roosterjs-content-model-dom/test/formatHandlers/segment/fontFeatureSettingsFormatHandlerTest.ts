import { fontFeatureSettingsFormatHandler } from '../../../lib/formatHandlers/segment/fontFeatureSettingsFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { FontFeatureSettingsFormat } from 'roosterjs-content-model-types';

describe('fontFeatureSettingsFormatHandler', () => {
    it('resolves inherited feature settings before source DOM is flattened', () => {
        const element = document.createElement('span');
        element.style.fontFeatureSettings = 'unset';
        const format: FontFeatureSettingsFormat = { fontFeatureSettings: '"calt" 0' };
        fontFeatureSettingsFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.fontFeatureSettings).toBe('"calt" 0');
    });
    it('keeps explicit same-tag CSS priority and independent feature flags', () => {
        const element = document.createElement('span');
        fontFeatureSettingsFormatHandler.apply(
            { wordStylisticSetFeatures: '"ss04" 1', fontFeatureSettings: '"ss04" 0, "calt" 0' },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontFeatureSettings).toBe('"ss04", "ss04" 0, "calt" 0');
    });
    it('keeps native stylistic sets when extra features are normal', () => {
        const element = document.createElement('span');
        fontFeatureSettingsFormatHandler.apply(
            { wordStylisticSetFeatures: '"ss04" 1', fontFeatureSettings: 'normal' },
            element,
            createModelToDomContext()
        );
        expect(element.style.fontFeatureSettings).toBe('"ss04"');
    });
    it('clears inherited native features when leaving the modeled formatting', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.wordStylisticSetFeatures = '"ss04" 1';
        fontFeatureSettingsFormatHandler.apply({}, element, context);
        expect(element.style.fontFeatureSettings).toBe('normal');
    });
});
