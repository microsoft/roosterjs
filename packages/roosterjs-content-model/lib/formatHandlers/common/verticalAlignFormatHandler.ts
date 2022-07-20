import { FormatHandler } from '../FormatHandler';
import { VerticalAlignFormat } from '../../publicTypes/format/formatParts/VerticalAlignFormat';

/**
 * @internal
 */
export const verticalAlignFormatHandler: FormatHandler<VerticalAlignFormat> = {
    parse: (format, element) => {
        const align = element.style.verticalAlign || element.getAttribute('valign');

        switch (align) {
            case 'baseline':
            case 'initial':
            case 'super':
            case 'sub':
            case 'text-top':
            case 'text-bottom':
            case 'top':
                format.verticalAlign = 'top';
                break;

            case 'bottom':
                format.verticalAlign = 'bottom';
                break;
        }
    },
    apply: (format, element) => {
        if (format.verticalAlign) {
            element.style.verticalAlign = format.verticalAlign;
        }
    },
};
