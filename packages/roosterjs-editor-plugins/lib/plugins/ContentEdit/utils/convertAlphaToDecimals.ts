/**
 * @internal
 * Convert english alphabet numbers into decimal numbers
 * @param letter The letter that needs to be converted
 * @returns
 */
export default function convertAlphaToDecimals(letter: string): number | null {
    const alpha = letter.toLocaleLowerCase();
    if (alpha) {
        let number = 0;
        const size = alpha.length - 1;
        for (let i = 0; i < alpha.length; i++) {
            number = 26 * size + alpha.charCodeAt(size) - 96;
        }
        return number;
    }
    return null;
}
