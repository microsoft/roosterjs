import type { FormatHandler } from '../FormatHandler';
import type { FontFeatureSettingsFormat, LetterSpacingFormat } from 'roosterjs-content-model-types';

type FeatureFormat = FontFeatureSettingsFormat & LetterSpacingFormat;

/**
 * @internal
 */
export const fontFeatureSettingsFormatHandler: FormatHandler<FeatureFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.fontFeatureSettings || defaultStyle.fontFeatureSettings;

        if (value) {
            format.fontFeatureSettings = value;
        }
    },
    apply: (format, element, context) => {
        const value = getFeatureSettings(format);
        if (value != getFeatureSettings(context.implicitFormat)) {
            element.style.fontFeatureSettings = value || 'normal';
        }
    },
};

function getFeatureSettings(format: FeatureFormat): string | undefined {
    const value = format.fontFeatureSettings;

    if (!format.wordLigatureFeatures || (value && value != 'normal' && !/^["']/.test(value))) {
        return value;
    }

    const spacing = parseFloat(format.letterSpacing || '');
    // Word gives nonzero character spacing priority over its ligature flags.
    const ligatures =
        Number.isFinite(spacing) && spacing != 0
            ? '"liga" 0, "clig" 0, "hlig" 0, "dlig" 0'
            : format.wordLigatureFeatures;

    return ligatures + (value && value != 'normal' ? ', ' + value : '');
}
