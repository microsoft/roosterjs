import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';

// Using the HSL (hue, saturation and lightness) representation for RGB color values.
// If the value of the lightness is less than 20, the color is dark.
// If the value of the lightness is more than 80, the color is bright
const DARK_COLORS_LIGHTNESS = 20;
const BRIGHT_COLORS_LIGHTNESS = 80;
const White = '#ffffff';
const Black = '#000000';
const RGBA_REGEX = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;

// Using the HSL (hue, saturation and lightness) representation for RGB color values.
// If the value of the lightness is less than 20, the color is dark.
// If the value of the lightness is more than 80, the color is bright
const DARK_COLORS_LIGHTNESS = 20;
const BRIGHT_COLORS_LIGHTNESS = 80;
const White = '#ffffff';
const Black = '#000000';
const RGBA_REGEX = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;

/**
 * @internal
 */
export function setTableCellBackgroundColor(
    cell: ContentModelTableCell,
    color: string | null | undefined,
    isColorOverride?: boolean
) {
    if (color) {
        cell.format.backgroundColor = color;

        if (isColorOverride) {
            updateTableCellMetadata(cell, metadata => {
                metadata = metadata || {};
                metadata.bgColorOverride = true;
                return metadata;
            });
        }

        const lightness = calculateLightness(color);

        if (lightness < DARK_COLORS_LIGHTNESS) {
            cell.format.textColor = White;
        } else if (lightness > BRIGHT_COLORS_LIGHTNESS) {
            cell.format.textColor = Black;
        } else {
            delete cell.format.textColor;
        }
    } else {
        delete cell.format.backgroundColor;
        delete cell.format.textColor;
    }
}

function calculateLightness(color: string) {
    let r: number;
    let g: number;
    let b: number;

    if (color.substring(0, 1) == '#') {
        [r, g, b] = parseHexColor(color);
    } else {
        [r, g, b] = parseRGBColor(color);
    }

    // Use the values of r,g,b to calculate the lightness in the HSl representation
    //First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have

    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    //Then the lightness in the HSL representation is the average between maximum fraction of r,g,b and the minimum fraction
    return (Math.max(red, green, blue) + Math.min(red, green, blue)) * 50;
}

function parseHexColor(color: string) {
    if (color.length === 4) {
        color = color.replace(/(.)/g, '$1$1');
    }

    const colors = color.replace('#', '');
    const r = parseInt(colors.substr(0, 2), 16);
    const g = parseInt(colors.substr(2, 2), 16);
    const b = parseInt(colors.substr(4, 2), 16);

    return [r, g, b];
}

function parseRGBColor(color: string) {
    const colors = color.match(RGBA_REGEX);

    if (colors) {
        const r = parseInt(colors[1]);
        const g = parseInt(colors[2]);
        const b = parseInt(colors[3]);
        return [r, g, b];
    } else {
        return [255, 255, 255];
    }
}
