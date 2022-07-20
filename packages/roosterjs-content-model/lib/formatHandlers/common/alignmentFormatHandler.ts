import { ContentModelAlignmentFormat } from '../../publicTypes/format/formatParts/ContentModelAlignmentFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const alignmentFormatHandler: FormatHandler<ContentModelAlignmentFormat> = {
    parse: (format, element, context) => {
        const horizontalAlign = element.style.textAlign;
        const verticalAlign = element.style.verticalAlign;

        switch (horizontalAlign) {
            case 'center':
                format.horizontalAlign = 'center';
                break;

            case 'left':
                format.horizontalAlign = context.isRightToLeft ? 'end' : 'start';
                break;

            case 'right':
                format.horizontalAlign = context.isRightToLeft ? 'start' : 'end';
                break;

            case 'start':
            case 'end':
                format.horizontalAlign = horizontalAlign;
                break;
        }

        switch (verticalAlign) {
            case 'baseline':
            case 'initial':
            case 'super':
            case 'sub':
            case 'text-top':
            case 'text-bottom':
            case 'top':
            case 'unset':
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

        if (format.horizontalAlign) {
            element.style.textAlign = format.horizontalAlign;
        }
    },
};
