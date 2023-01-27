import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { extractBorderValues } from '../../domUtils/borderValues';
import { ptToPx } from '../../formatHandlers/utils/pointsToPixels';

/**
 * @internal
 */
export default function applyImageBorderFormat(
    image: ContentModelImage,
    color?: string,
    style?: string,
    width?: string,
    isPt?: boolean
) {
    const format = image.format;
    const border = extractBorderValues(format['borderTop']);
    const borderColor = border.color;
    const borderWidth = border.width;
    const borderStyle = border.style;
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
