import { updateTableCellMetadata } from '../../metadata/updateTableCellMetadata';
import type { ContentModelTableCell } from 'roosterjs-content-model-types';

// Using the HSL (hue, saturation and lightness) representation for RGB color values.
// If the value of the lightness is less than 20, the color is dark.
// If the value of the lightness is more than 80, the color is bright
const DARK_COLORS_LIGHTNESS = 20;
const BRIGHT_COLORS_LIGHTNESS = 80;
const White = '#ffffff';
const Black = '#000000';

/**
 * Set shade color of table cell
 * @param cell The cell to set shade color to
 * @param color The color to set
 * @param isColorOverride @optional When pass true, it means this shade color is not part of table format, so it can be preserved when apply table format
 * @param applyToSegments @optional When pass true, we will also apply text color from table cell to its child blocks and segments
 */
export function setTableCellBackgroundColor(
    cell: ContentModelTableCell,
    color: string | null | undefined,
    isColorOverride?: boolean,
    applyToSegments?: boolean
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

        if (applyToSegments && cell.format.textColor) {
            cell.blocks.forEach(block => {
                if (block.blockType == 'Paragraph') {
                    block.segmentFormat = {
                        ...block.segmentFormat,
                        textColor: cell.format.textColor,
                    };
                    block.segments.forEach(segment => {
                        segment.format = {
                            ...segment.format,
                            textColor: cell.format.textColor,
                        };
                    });
                }
            });
        }
    } else {
        delete cell.format.backgroundColor;
        delete cell.format.textColor;
    }

    delete cell.cachedElement;
}

function calculateLightness(color: string) {
    const colorValues = parseColor(color);

    // Use the values of r,g,b to calculate the lightness in the HSl representation
    //First calculate the fraction of the light in each color, since in css the value of r,g,b is in the interval of [0,255], we have
    if (colorValues) {
        const red = colorValues[0] / 255;
        const green = colorValues[1] / 255;
        const blue = colorValues[2] / 255;

        //Then the lightness in the HSL representation is the average between maximum fraction of r,g,b and the minimum fraction
        return (Math.max(red, green, blue) + Math.min(red, green, blue)) * 50;
    } else {
        return 255;
    }
}

const HEX3_REGEX = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/;
const HEX6_REGEX = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/;
const RGB_REGEX = /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
const RGBA_REGEX = /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;

/**
 * @internal Export for test only
 * Parse color string to r/g/b value.
 * If the given color is not in a recognized format, return null
 */
export function parseColor(color: string): [number, number, number] | null {
    color = (color || '').trim();

    let match: RegExpMatchArray | null;
    if ((match = color.match(HEX3_REGEX))) {
        return [
            parseInt(match[1] + match[1], 16),
            parseInt(match[2] + match[2], 16),
            parseInt(match[3] + match[3], 16),
        ];
    } else if ((match = color.match(HEX6_REGEX))) {
        return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
    } else if ((match = color.match(RGB_REGEX) || color.match(RGBA_REGEX))) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    } else {
        // CSS color names such as red, green is not included for now.
        // If need, we can add those colors from https://www.w3.org/wiki/CSS/Properties/color/keywords
        return null;
    }
}
