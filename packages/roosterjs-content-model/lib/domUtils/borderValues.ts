import { Border } from '../publicTypes/interface/Border';

const BorderStyles = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
];
const BorderSizeRegex = /^(thin|medium|thick|[\d\.]+\w*)$/;

/**
 * Extract an integrated border string with border width, style, color to value tuple
 * @param combinedBorder The integrated border style string
 * @returns An array with the splitted values
 */
export function extractBorderValues(combinedBorder?: string): Border {
    const result: Border = {};
    const values = (combinedBorder || '').replace(/, /g, ',').split(' ');

    values.forEach(v => {
        if (BorderStyles.indexOf(v) >= 0 && !result.style) {
            result.style = v;
        } else if (BorderSizeRegex.test(v) && !result.width) {
            result.width = v;
        } else if (v && !result.color) {
            result.color = v; // TODO: Do we need to use a regex to match all possible colors?
        }
    });

    return result;
}

/**
 * Combine border value array back to string
 * @param values Input string values
 * @param initialValue Initial value for those items without valid value
 */
export function combineBorderValue(value: Border): string {
    return [value.width || '', value.style || '', value.color || ''].join(' ').trim() || 'none';
}
