import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { FormatHandler } from '../FormatHandler';
import { parseValueWithUnit } from '../utils/parseValueWithUnit';

/**
 * @internal
 */
export const computedSegmentFormatHandler: FormatHandler<ContentModelSegmentFormat> = {
    parse: (format, element) => {
        const computedStyles = element.ownerDocument.defaultView?.getComputedStyle(element);

        if (computedStyles) {
            const { fontFamily, fontSize } = computedStyles;

            // Only read font family and size from root container.
            // For others, keep them undefined since it is not normal to have bold/italic/... in root container
            // and we skip colors on purpose since we will get inverted color in dark mode which is not right.
            if (fontFamily) {
                format.fontFamily = fontFamily;
            }

            if (fontSize) {
                format.fontSize = parseValueWithUnit(fontSize, undefined /*element*/, 'pt') + 'pt';
            }
        }
    },
    apply: () => {},
};
