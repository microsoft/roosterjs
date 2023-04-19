import { Border } from '../../publicTypes/interface/Border';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { extractBorderValues } from '../../domUtils/borderValues';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';

/**
 * @internal
 */
export default function applyImageBorderFormat(
    image: ContentModelImage,
    border: Border | null,
    borderRadius?: string
) {
    if (border) {
        const format = image.format;
        const { width, style, color } = border;
        const borderKey = 'borderTop';
        const extractedBorder = extractBorderValues(format[borderKey]);
        const borderColor = extractedBorder.color;
        const borderWidth = extractedBorder.width;
        const borderStyle = extractedBorder.style;
        let borderFormat = '';

        if (width) {
            borderFormat = parseValueWithUnit(width) + 'px';
        } else if (borderWidth) {
            borderFormat = borderWidth;
        } else {
            borderFormat = '1px';
        }

        if (style) {
            borderFormat = `${borderFormat} ${style}`;
        } else if (borderStyle) {
            borderFormat = `${borderFormat} ${borderStyle}`;
        } else {
            borderFormat = `${borderFormat} solid`;
        }

        if (color) {
            borderFormat = `${borderFormat} ${color}`;
        } else if (borderColor) {
            borderFormat = `${borderFormat} ${borderColor}`;
        }
        image.format.borderLeft = borderFormat;
        image.format.borderTop = borderFormat;
        image.format.borderBottom = borderFormat;
        image.format.borderRight = borderFormat;
    } else {
        delete image.format.borderLeft;
        delete image.format.borderTop;
        delete image.format.borderBottom;
        delete image.format.borderRight;
    }

    if (borderRadius) {
        image.format.borderRadius = borderRadius;
    }
}
