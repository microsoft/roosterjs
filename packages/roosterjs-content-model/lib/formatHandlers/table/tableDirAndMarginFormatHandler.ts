import { DirectionFormat } from '../../publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from '../block/directionFormatHandler';
import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { marginFormatHandler } from '../paragraph/marginFormatHandler';

/**
 * @internal
 */
export const tableDirAndMarginFormatHandler: FormatHandler<DirectionFormat & MarginFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const dirFormat: DirectionFormat = {};

        if (format.direction) {
            dirFormat.direction = format.direction;
        }

        directionFormatHandler.parse(dirFormat, element, context, defaultStyle);

        // Handle alignment format inherited from parent elements first
        if (element.tagName == 'TABLE') {
            if (format.htmlAlign && !format.textAlign) {
                const isRtl = dirFormat.direction == 'rtl';

                format[isRtl ? 'marginRight' : 'marginLeft'] =
                    format.htmlAlign == 'start' ? '' : 'auto';
                format[isRtl ? 'marginLeft' : 'marginRight'] =
                    format.htmlAlign == 'end' ? '' : 'auto';
            }

            delete format.htmlAlign;
        }

        // Then overwrite with format from this element
        Object.assign(format, dirFormat);

        marginFormatHandler.parse(format, element, context, defaultStyle);
    },
    apply: (format, element, context) => {
        directionFormatHandler.apply(format, element, context);
        marginFormatHandler.apply(format, element, context);
    },
};
