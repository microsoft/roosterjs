// Match a word or word with "(...)" that may have space inside
// e.g.
//   test
//   test(1, 2, 3)
const BorderValuesRegex = /(\w*\([^\)]*\)\w*|[^\s]+)/g;

/**
 * Extract an integrated border string (something like 'top right bottom left') to value array
 * @param integratedBorder The integrated border style string
 * @returns An array with the splitted values
 */
export function extractBorderValues(integratedBorder: string): string[] {
    let match = BorderValuesRegex.exec(integratedBorder);
    const result: string[] = [];

    while (match) {
        result.push(match[0]);
        match = BorderValuesRegex.exec(integratedBorder);
    }

    result[0] = result[0] || '';
    result[1] = result[1] || result[0];
    result[2] = result[2] || result[0];
    result[3] = result[3] || result[1];

    return result;
}
