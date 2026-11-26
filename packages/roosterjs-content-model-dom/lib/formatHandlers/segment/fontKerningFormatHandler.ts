import { parseValueWithUnit } from '../utils/parseValueWithUnit';
import type { FormatHandler } from '../FormatHandler';
import type { FontKerningFormat, FontSizeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontKerningFormatHandler: FormatHandler<FontKerningFormat & FontSizeFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const kerning = element.style.fontKerning || defaultStyle.fontKerning;

        if (kerning) {
            format.fontKerning = kerning;
            delete format.wordKerningThreshold;
        }
    },
    apply: (format, element, context) => {
        const implicitSize = context.implicitFormat.fontSize;
        const baseSize = implicitSize
            ? parseValueWithUnit(implicitSize, context.rootFontSize)
            : context.rootFontSize;
        const inheritedSize = parseValueWithUnit(baseSize + 'px', undefined, 'pt');
        const size =
            format.fontSize && format.fontSize != implicitSize
                ? parseValueWithUnit(format.fontSize, baseSize, 'pt')
                : inheritedSize;
        const kerning = getKerning(format, size);
        const implicitKerning = getKerning(context.implicitFormat, inheritedSize);

        if (kerning != implicitKerning) {
            element.style.fontKerning = kerning || 'auto';
        }
    },
};

function getKerning(format: FontKerningFormat, size: number): string | undefined {
    if (format.fontKerning) {
        return format.fontKerning;
    } else if (
        format.wordKerningThreshold &&
        /^(?:\d+(?:\.\d+)?|\.\d+)pt$/i.test(format.wordKerningThreshold)
    ) {
        const threshold = parseFloat(format.wordKerningThreshold);

        if (threshold == 0) {
            return 'none';
        } else if (Number.isFinite(threshold) && size > 0) {
            return size >= threshold ? 'normal' : 'none';
        }
    }

    return undefined;
}
