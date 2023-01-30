import { Border, extractBorderValues } from '../../domUtils/borderValues';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ptToPx } from '../../formatHandlers/utils/pointsToPixels';

/**
 * @internal
 */
export default function applyImageBorderFormat(
    image: ContentModelImage,
    border: Border,
    isPt?: boolean
) {
    const format = image.format;
    const { width, style, color } = border;
    const borderKey = 'borderTop';
    const extractedBorder = extractBorderValues(format[borderKey]);
    const borderColor = extractedBorder.color;
    const borderWidth = extractedBorder.width;
    const borderStyle = extractedBorder.style;
    let borderFormat = '';

    if (width) {
        borderFormat = isPt ? ptToPx(parseInt(width)) + 'px' : width;
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

    image.format.borderRadius = '5px';

    image.format.borderLeft = borderFormat;
    image.format.borderTop = borderFormat;
    image.format.borderBottom = borderFormat;
    image.format.borderRight = borderFormat;
}
