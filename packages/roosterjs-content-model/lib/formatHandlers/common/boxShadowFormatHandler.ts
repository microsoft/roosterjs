import { BoxShadowFormat } from '../../publicTypes/format/formatParts/BoxShadowFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const boxShadowFormatHandler: FormatHandler<BoxShadowFormat> = {
    parse: (format, element) => {
        if (element.style?.boxShadow) {
            format.boxShadow = element.style.boxShadow;
        }
    },
    apply: (format, element) => {
        if (format.boxShadow) {
            element.style.boxShadow = format.boxShadow;
        }
    },
};
