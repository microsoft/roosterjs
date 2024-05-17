import { mutateBlock } from '../common/mutate';
import { parseColor } from '../../formatHandlers/utils/color';
import { updateTableCellMetadata } from '../metadata/updateTableCellMetadata';
import type { ShallowMutableContentModelTableCell } from 'roosterjs-content-model-types';

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
    cell: ShallowMutableContentModelTableCell,
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

        if (applyToSegments) {
            setAdaptiveCellColor(cell);
        }
    } else {
        delete cell.format.backgroundColor;
        delete cell.format.textColor;
        if (applyToSegments) {
            removeAdaptiveCellColor(cell);
        }
    }

    delete cell.cachedElement;
}

function removeAdaptiveCellColor(cell: ShallowMutableContentModelTableCell) {
    cell.blocks.forEach(readonlyBlock => {
        if (readonlyBlock.blockType == 'Paragraph') {
            const block = mutateBlock(readonlyBlock);

            if (
                block.segmentFormat?.textColor &&
                shouldRemoveColor(block.segmentFormat?.textColor, cell.format.backgroundColor || '')
            ) {
                delete block.segmentFormat.textColor;
            }
            block.segments.forEach(segment => {
                if (
                    segment.format.textColor &&
                    shouldRemoveColor(segment.format.textColor, cell.format.backgroundColor || '')
                ) {
                    delete segment.format.textColor;
                }
            });
        }
    });
}

function setAdaptiveCellColor(cell: ShallowMutableContentModelTableCell) {
    if (cell.format.textColor) {
        cell.blocks.forEach(readonlyBlock => {
            if (readonlyBlock.blockType == 'Paragraph') {
                const block = mutateBlock(readonlyBlock);

                if (!block.segmentFormat?.textColor) {
                    block.segmentFormat = {
                        ...block.segmentFormat,
                        textColor: cell.format.textColor,
                    };
                }
                block.segments.forEach(segment => {
                    if (!segment.format?.textColor) {
                        segment.format = {
                            ...segment.format,
                            textColor: cell.format.textColor,
                        };
                    }
                });
            }
        });
    }
}

/**
 * If the cell background color is too dark or too bright, and the text color is white or black, we should remove the text color
 * @param textColor the segment or block text color
 * @param cellBackgroundColor the cell background color
 * @returns
 */
function shouldRemoveColor(textColor: string, cellBackgroundColor: string) {
    const lightness = calculateLightness(cellBackgroundColor);
    if (
        ([White, 'rgb(255,255,255)'].indexOf(textColor) > -1 &&
            (lightness > BRIGHT_COLORS_LIGHTNESS || cellBackgroundColor == '')) ||
        ([Black, 'rgb(0,0,0)'].indexOf(textColor) > -1 &&
            (lightness < DARK_COLORS_LIGHTNESS || cellBackgroundColor == ''))
    ) {
        return true;
    }
    return false;
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
