import { TableMetadata } from '../table/tableMetadata';

const SELECTION_COLOR_OPACITY = TableMetadata.SELECTION_COLOR_OPACITY;

/**
 * @internal
 * Retrieve the color to be applied when a cell is selected
 * @param colorString Color
 * @returns color to be applied when a cell is selected
 */
export function getHighlightColor(colorString: string) {
    if (colorString && (colorString.indexOf('rgba') > -1 || colorString.indexOf('rgb') > -1)) {
        const rgb = colorString
            .trim()
            .substring(colorString.indexOf('(') + 1, colorString.length - 1)
            .split(',');

        const red = parseInt(rgb[0]);
        const green = parseInt(rgb[1]);
        const blue = parseInt(rgb[2]);
        if (red && green && blue) {
            return `rgba(${red}, ${green}, ${blue}, ${SELECTION_COLOR_OPACITY})`;
        }
    }

    return `rgba(198,198,198, ${SELECTION_COLOR_OPACITY})`;
}

/**
 * @internal
 * Get the original color before the selection was made
 * @param colorString Color
 * @returns original color before the selection was made
 */
export function getOriginalColor(colorString: string) {
    const color = getColor(colorString);

    if (color) {
        return color;
    }

    return '';
}

function getColor(colorString: string, prefix: string = 'rgb') {
    if (colorString && (colorString.indexOf('rgba') > -1 || colorString.indexOf('rgb') > -1)) {
        const rgb = colorString
            .trim()
            .substring(colorString.indexOf('(') + 1, colorString.length - 1)
            .split(',');
        colorString = `${prefix}(${rgb[0]}, ${rgb[1]}, ${rgb[2]}${
            prefix == 'rgba' ? ', ' + SELECTION_COLOR_OPACITY : ''
        })`;
    }
    return colorString;
}
