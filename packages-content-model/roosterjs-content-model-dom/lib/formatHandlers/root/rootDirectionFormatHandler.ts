import { DirectionFormat } from 'roosterjs-content-model-types';
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
