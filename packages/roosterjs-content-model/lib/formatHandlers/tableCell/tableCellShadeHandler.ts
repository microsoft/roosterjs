import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { DarkModeDatasetNames } from 'roosterjs-editor-types';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const tableCellShadeHandler: FormatHandler<ContentModelTableCellFormat> = {
    parse: (format, element, context) => {
        const shadeColor =
            (context.isDarkMode &&
                (element.dataset[DarkModeDatasetNames.OriginalStyleBackgroundColor] ||
                    element.dataset[DarkModeDatasetNames.OriginalAttributeBackgroundColor])) ||
            element.style.backgroundColor;

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
