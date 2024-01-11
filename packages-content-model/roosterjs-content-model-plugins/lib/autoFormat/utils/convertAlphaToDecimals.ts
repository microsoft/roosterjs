/**
 * @internal
 * Convert english alphabet numbers into decimal numbers
 * @param letter The letter that needs to be converted
 * @returns
 */
export default function convertAlphaToDecimals(letter: string): number | undefined {
    const alpha = letter.toUpperCase();
    if (alpha) {
        let result = 0;
        for (let i = 0; i < alpha.length; i++) {
            const charCode = alpha.charCodeAt(i) - 65 + 1;
            result = result * 26 + charCode;
        }

        return result;
    }
    return undefined;
}
