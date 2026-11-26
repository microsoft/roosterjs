import type { FormatHandler } from '../FormatHandler';
import type { FontFeatureSettingsFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontFeatureSettingsFormatHandler: FormatHandler<FontFeatureSettingsFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.fontFeatureSettings || defaultStyle.fontFeatureSettings;
        if (value && value != 'inherit' && value != 'unset') {
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

function getFeatureSettings(format: FontFeatureSettingsFormat): string | undefined {
    const value = format.fontFeatureSettings;
    if (!format.wordStylisticSetFeatures || (value && value != 'normal' && !/^["']/.test(value))) {
        return value;
    }
    return format.wordStylisticSetFeatures + (value && value != 'normal' ? ', ' + value : '');
}
