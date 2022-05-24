const ALPHABET: Record<number, string> = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    10: 'J',
    11: 'K',
    12: 'L',
    13: 'M',
    14: 'N',
    15: 'O',
    16: 'P',
    17: 'Q',
    18: 'R',
    19: 'S',
    20: 'T',
    21: 'U',
    22: 'V',
    23: 'W',
    24: 'X',
    25: 'Y',
    26: 'Z',
};

/**
 * @internal
 * Convert decimal numbers into english alphabet letters
 * @param decimal The decimal number that needs to be converted
 * @param isLowerCase if true the roman value will appear in lower case
 * @returns
 */
export default function convertDecimalsToAlpha(decimal: number, isLowerCase?: boolean): string {
    if (decimal < 27) {
        return isLowerCase ? ALPHABET[decimal].toLowerCase() : ALPHABET[decimal];
    } else {
        let alpha = '';
        let quotient = Math.floor(decimal / 26);
        let module = decimal % 26;
        alpha = ALPHABET[quotient] + ALPHABET[module] + alpha;
        return isLowerCase ? alpha.toLowerCase() : alpha;
    }
}
