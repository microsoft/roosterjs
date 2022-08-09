// Match a word or word with "(...)" that may have space inside
// e.g.
//   test
//   test(1, 2, 3)
const BorderValuesRegex = /(\w*\([^\)]*\)\w*|[^\s]+)/g;

/**
 * Index of border values
 */
export const BorderIndex = {
    Top: 0,
    Right: 1,
    Bottom: 2,
    Left: 3,
};

/**
 * Extract an integrated border string (something like 'top right bottom left') to value array
 * @param combinedBorder The integrated border style string
 * @returns An array with the splitted values
 */
export function extractBorderValues(combinedBorder: string): string[] {
    let match = BorderValuesRegex.exec(combinedBorder);
    const result: string[] = [];

    while (match) {
        result.push(match[0]);
        match = BorderValuesRegex.exec(combinedBorder);
    }

    result[0] = result[0] || '';
    result[1] = result[1] || result[0];
    result[2] = result[2] || result[0];
    result[3] = result[3] || result[1];

    return result.slice(0, 4);
}

/** Combine border value array back to string */
export function combineBorderValue(values: string[], initialValue: string): string {
    return values
        .slice(0, 4)
        .map(v => v || initialValue)
        .join(' ');
}
