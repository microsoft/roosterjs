import { DirectionFormat } from '../../publicTypes/format/formatParts/DirectionFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const rootDirectionFormatHandler: FormatHandler<DirectionFormat> = {
    parse: (format, element) => {
        const style = element.ownerDocument.defaultView?.getComputedStyle(element);

        if (style?.direction == 'rtl') {
            format.direction = 'rtl';
        }
    },
    apply: () => {},
};
