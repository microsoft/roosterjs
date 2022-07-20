import { ContentModelBackgroundColorFormat } from '../../publicTypes/format/formatParts/ContentModelBackgroundColorFormat';
import { DarkModeDatasetNames } from 'roosterjs-editor-types';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const backgroundColorFormatHandler: FormatHandler<ContentModelBackgroundColorFormat> = {
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
