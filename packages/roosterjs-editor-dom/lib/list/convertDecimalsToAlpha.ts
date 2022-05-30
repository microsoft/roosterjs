const ALPHABET: Record<number, string> = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J',
    10: 'K',
    11: 'L',
    12: 'M',
    13: 'N',
    14: 'O',
    15: 'P',
    16: 'Q',
    17: 'R',
    18: 'S',
    19: 'T',
    20: 'U',
    21: 'V',
    22: 'W',
    23: 'X',
    24: 'Y',
    25: 'Z',
};

/**
 * @internal
 * Convert decimal numbers into english alphabet letters
 * @param decimal The decimal number that needs to be converted
 * @param isLowerCase if true the roman value will appear in lower case
 * @returns
 */
export default function convertDecimalsToAlpha(decimal: number, isLowerCase?: boolean): string {
    let alpha = '';
    while (decimal >= 0) {
        alpha = ALPHABET[decimal % 26] + alpha;
        decimal = Math.floor(decimal / 26) - 1;
    }
    return isLowerCase ? alpha.toLowerCase() : alpha;
}
