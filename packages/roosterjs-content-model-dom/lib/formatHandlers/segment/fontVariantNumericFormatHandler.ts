import { shouldSetValue } from '../utils/shouldSetValue';
import type { FormatHandler } from '../FormatHandler';
import type { FontVariantNumericFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontVariantNumericFormatHandler: FormatHandler<FontVariantNumericFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.fontVariantNumeric || defaultStyle.fontVariantNumeric;

        if (
            value != 'unset' &&
            shouldSetValue(
                value,
                'normal',
                format.fontVariantNumeric,
                defaultStyle.fontVariantNumeric
            )
        ) {
            format.fontVariantNumeric = value;
        }
        if (
            value &&
            value != 'inherit' &&
            value != 'unset' &&
            (value != 'normal' ||
                /(?:^|;)\s*font-variant-numeric\s*:/i.test(element.style.cssText) ||
                defaultStyle.fontVariantNumeric)
        ) {
            delete format.wordNumberSpacing;
        }
    },
    apply: (format, element, context) => {
        const value = getNumericVariant(format);
        if (value != getNumericVariant(context.implicitFormat)) {
            element.style.fontVariantNumeric = value || 'normal';
        }
    },
};

function getNumericVariant(format: FontVariantNumericFormat): string | undefined {
    const value = format.fontVariantNumeric;
    if (!format.wordNumberSpacing) {
        return value;
    }

    const tokens = value && value != 'normal' ? value.split(/\s+/).filter(Boolean) : [];
    if (
        tokens.some(
            token =>
                !/^(lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|ordinal|slashed-zero)$/.test(
                    token
                )
        )
    ) {
        return value;
    }
    const remaining = tokens.filter(
        token => token != 'tabular-nums' && token != 'proportional-nums'
    );
    if (format.wordNumberSpacing != 'default') {
        remaining.push(
            format.wordNumberSpacing == 'tabular' ? 'tabular-nums' : 'proportional-nums'
        );
    }
    return remaining.join(' ') || 'normal';
}
