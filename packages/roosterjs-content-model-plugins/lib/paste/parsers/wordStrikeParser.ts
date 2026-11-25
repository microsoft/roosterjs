import { getStyles } from '../utils/getStyles';
import type { FormatParser, StrikeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 * Convert Word's legacy double line-through property to an independent strike style.
 */
export const wordStrikeParser: FormatParser<StrikeFormat> = (format, element) => {
    const value = getStyles(element)['text-line-through'];

    if (value == 'double' && format.strikethrough) {
        format.strikethroughStyle = 'double';
    } else if (value == 'none') {
        delete format.strikethroughStyle;
    }
};
