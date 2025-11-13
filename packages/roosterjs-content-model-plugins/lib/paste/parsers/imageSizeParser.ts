import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import type { ContentModelImageFormat, FormatParser } from 'roosterjs-content-model-types';

// Only process absolute units (px, pt, in, cm, mm)
const AbsoluteUnitRegex = /^\s*\d+(\.\d+)?\s*(px|pt|in|cm|mm)\s*$/i;

/**
 * @internal
 * Remove image size if it is larger than editor view width to let it auto size
 */
export const imageSizeParser: FormatParser<ContentModelImageFormat> = (
    format,
    element,
    context
) => {
    const maxImageSize = context.editorViewWidth;
    const { width } = format;

    if (width && maxImageSize && AbsoluteUnitRegex.test(width)) {
        const widthValue = parseValueWithUnit(width, element);

        // If the given width is larger than editor view width, we clear both width and height to let it auto size
        if (widthValue > maxImageSize) {
            delete format.width;
            delete format.height;
        }
    }
};
