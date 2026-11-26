import { getStyles } from '../utils/getStyles';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const wordUnderlineColorParser: FormatParser<ContentModelSegmentFormat> = (
    format,
    element,
    _context,
    defaultStyle
) => {
    if (!element.style.textDecorationColor && !defaultStyle.textDecorationColor) {
        const styles = getStyles(element);
        const key = Object.keys(styles)
            .filter(name => name.toLowerCase() == 'text-underline')
            .pop();
        const value = key ? styles[key] : '';
        const probe = element.ownerDocument.createElement('span');

        // Compound Word decoration values are not scalar CSS colors.
        probe.style.color = value;
        const color = probe.style.color;

        if (
            color &&
            ['inherit', 'initial', 'unset', 'revert', 'revert-layer', 'currentcolor'].indexOf(
                color.toLowerCase()
            ) < 0
        ) {
            format.underlineColor = color;
        }
    }
};
