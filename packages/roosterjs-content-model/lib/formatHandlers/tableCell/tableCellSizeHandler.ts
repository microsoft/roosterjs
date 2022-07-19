import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const tableCellSizeHandler: FormatHandler<ContentModelTableCellFormat> = {
    parse: (format, element, context) => {
        const size = element.getBoundingClientRect();

        if (size?.width > 0) {
            format.width = size.width / context.zoomScale;
        }

        if (size?.height > 0) {
            format.height = size.height / context.zoomScale;
        }
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
