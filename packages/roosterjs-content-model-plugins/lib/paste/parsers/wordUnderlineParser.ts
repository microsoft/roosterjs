import { getStyles } from '../utils/getStyles';
import type { FormatParser, UnderlineFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 * Preserve the supported Word underline variants using standard CSS styles.
 */
export const wordUnderlineParser: FormatParser<UnderlineFormat> = (format, element) => {
    if (!format.underline || element.style.textDecoration == 'none') {
        return;
    }

    const style = getStyles(element)['text-underline']?.toLowerCase();

    if (style == 'double' || style == 'wave') {
        format.underlineStyle = style == 'wave' ? 'wavy' : 'double';
    }
};
