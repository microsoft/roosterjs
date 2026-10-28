import type { FormatHandler } from '../FormatHandler';
import type { VerticalAlignFormat } from 'roosterjs-content-model-types';

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

            case 'middle':
                format.verticalAlign = 'middle';
                break;
        }
    },
    apply: (format, element) => {
        if (element.tagName == 'IMG') {
            // Default all images to vertical-align: middle unless a different value was explicitly set
            element.style.verticalAlign = format.verticalAlign ?? 'middle';
        } else if (format.verticalAlign) {
            element.style.verticalAlign = format.verticalAlign;
        }
    },
};
