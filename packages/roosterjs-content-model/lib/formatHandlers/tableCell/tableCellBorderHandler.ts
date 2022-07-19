import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from '../FormatHandler';

const Directions = ['top', 'right', 'bottom', 'left'];

function read(element: HTMLElement, style: 'width' | 'style' | 'color') {
    return Directions.map(dir => element.style.getPropertyValue(`border-${dir}-${style}`));
}

// There should be 4 items in array in the order of 'top right bottom left'.
// To make the result shorter, we can do the following according to CSS standard:
//
// When all of them are the same, we just output that item value
// When top == bottom and right == left, we output 'top right'
// When top != bottom but right == left, we output 'top right bottom'
// Otherwise, we output 'top right bottom left'
function writeStyle(
    element: HTMLElement,
    styleArray: string[] | undefined,
    style: 'width' | 'style' | 'color'
) {
    let css: string | undefined;

    if (styleArray && !styleArray.every(x => x == 'initial' || x == 'inherit')) {
        if (styleArray.length && styleArray[1] == styleArray[3]) {
            if (styleArray[0] == styleArray[2]) {
                if (styleArray[0] == styleArray[1]) {
                    css = styleArray[0];
                } else {
                    css = `${styleArray[0]} ${styleArray[1]}`;
                }
            } else {
                css = `${styleArray[0]} ${styleArray[1]} ${styleArray[2]}`;
            }
        } else {
            css = styleArray.join(' ');
        }
    }

    if (css) {
        element.style.setProperty('border-' + style, css);
    }
}

/**
 * @internal
 */
export const tableCellBorderHandler: FormatHandler<ContentModelTableCellFormat> = {
    parse: (format, element) => {
        format.borderColor = read(element, 'color');
        format.borderWidth = read(element, 'width');
        format.borderStyle = read(element, 'style');
    },
    apply: (format, element) => {
        writeStyle(element, format.borderColor, 'color');
        writeStyle(element, format.borderWidth, 'width');
        writeStyle(element, format.borderStyle, 'style');
    },
};
