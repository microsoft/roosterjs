import type { FormatHandler } from '../FormatHandler';
import type {
    FontFeatureSettingsFormat,
    FontVariantLigaturesFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontVariantLigaturesFormatHandler: FormatHandler<
    FontVariantLigaturesFormat & FontFeatureSettingsFormat
> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.fontVariantLigatures || defaultStyle.fontVariantLigatures;

        if (value) {
            format.fontVariantLigatures = value;
            delete format.wordLigatureFeatures;
        }
    },
    apply: (format, element, context) => {
        if (format.fontVariantLigatures != context.implicitFormat.fontVariantLigatures) {
            element.style.fontVariantLigatures = format.fontVariantLigatures || 'normal';
        }
    },
};
