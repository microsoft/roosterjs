import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const tableCellShadeHandler: FormatHandler<ContentModelTableCellFormat> = {
    parse: (format, element) => {
        const shadeColor = element.style.backgroundColor;

        if (shadeColor && shadeColor != 'transparent') {
            format.shadeColor = shadeColor;
        }
    },
    apply: (format, element) => {
        if (format.shadeColor) {
            element.style.backgroundColor = format.shadeColor;
        }
    },
};
