import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const tableCellSizeHandler: FormatHandler<ContentModelTableCellFormat> = {
    parse: (format, element, context) => {
        const size = element.getBoundingClientRect();
        format.width = size.width / context.zoomScale;
        format.height = size.height / context.zoomScale;
    },
    apply: (format, element) => {
        if (format.width! > 0) {
            element.style.width = format.width + 'px';
        }
        if (format.height! > 0) {
            element.style.height = format.height + 'px';
        }
    },
};
