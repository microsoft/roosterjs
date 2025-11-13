import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import type { ContentModelImageFormat, FormatParser } from 'roosterjs-content-model-types';

export const imageSizeParser: FormatParser<ContentModelImageFormat> = (
    format,
    element,
    context
) => {
    const maxImageSize = context.editorViewWidth;
    const { width } = format;

    if (width && maxImageSize) {
        const widthValue = parseValueWithUnit(width, element);

        // If the given width is larger than editor view width, we clear both width and height to let it auto size
        if (widthValue > maxImageSize) {
            delete format.width;
            delete format.height;
        }
    }
};
