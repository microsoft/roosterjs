/**
 * @internal
 */
export const isLetterFollowedByMarker = (text: string): boolean => {
    if (!text || text.length !== 2) {
        return false;
    }

    // Check if the string ends with ), . or -
    const lastChar = text[text.length - 1];
    if (lastChar !== ')' && lastChar !== '.' && lastChar !== '-') {
        return false;
    }

    // Check if the first character is a single letter
    const firstChar = text[0];
    return /^[a-zA-Z]$/.test(firstChar);
};
